import { Injectable, Signal, WritableSignal, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationService } from './communication.service';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { TournamentApplication,
  RegistrationsCount,
  Tournament,
  TournamentCSGOGroup,
  TournamentGroup,
  TournamentSC2Group,
  TournamentParticipant
 } from '../models/tournament';
import { TournamentCSGOMatch, TournamentSC2Match, TournamentCSGOMatchMap, TournamentSC2MatchMap } from '../models/tournament-schedule';

@Injectable({
  providedIn: 'root'
})
export class ApiTournamentsService {
  private http = inject(HttpClient);
  private commService = inject(CommunicationService);

  private _loadingCSGORegistrations = signal(false);
  private _loadingSC2Registrations = signal(false);
  private _loadingCSGOMatches = signal(false);
  private _loadingSC2Matches = signal(false);
  private _loadingSC2Groups = signal(false);
  private _loadingTourRegistrations = signal(false);
  private _registrationsCount = signal<RegistrationsCount []>(null);

  public readonly loadingCSGORegistrations = this._loadingCSGORegistrations.asReadonly();
  public readonly loadingSC2Registrations = this._loadingSC2Registrations.asReadonly();
  public readonly loadingCSGOMatches = this._loadingCSGOMatches.asReadonly();
  public readonly loadingSC2Matches = this._loadingSC2Matches.asReadonly();
  public readonly loadingSC2Groups = this._loadingSC2Groups.asReadonly();
  public readonly loadingTourRegistrations = this._loadingTourRegistrations.asReadonly();
  public readonly registrationsCount = this._registrationsCount.asReadonly();

  private _apiEndpoint = environment.apiEndpoint;

  private _tournaments = signal<Tournament []>(null);
  private _activeTournament = signal<Tournament>(null);
  private _companies = signal<string []>(null);
  private _allRegistrations = signal<TournamentApplication []>(null);
  private _myTournaments = signal<Tournament []>(null);
  private _tournamentsById = new Map<string, WritableSignal<Tournament>>();
  private _tourRegistrations = new Map<string, WritableSignal<TournamentApplication []>>();
  private _csgoRegistrations = new Map<string, WritableSignal<TournamentParticipant []>>();
  private _sc2Registrations = new Map<string, WritableSignal<TournamentParticipant []>>();
  private _csgoMatches = new Map<string, WritableSignal<TournamentCSGOMatch []>>();
  private _sc2Matches = new Map<string, WritableSignal<TournamentSC2Match []>>();
  private _csgoGroups = new Map<string, WritableSignal<TournamentCSGOGroup []>>();
  private _sc2Groups = new Map<string, WritableSignal<TournamentSC2Group []>>();

  /** Cache signals that currently have a request in flight, so concurrent reads don't duplicate it. */
  private _pending = new WeakSet<WritableSignal<unknown>>();

  public get tournaments(): Signal<Tournament []> {
    return this.lazy(this._tournaments, () => this.getTournaments());
  }

  public getTournament(id: string): Signal<Tournament> {
    return untracked(() => {
      let entry = this._tournamentsById.get(id);
      if (!entry) {
        const listed = this._tournaments()?.find(t => t.id === id);
        entry = signal<Tournament>(listed ?? null);
        this._tournamentsById.set(id, entry);
        if (!listed) {
          this.fetchInto(entry, this.getTournamentFromServer(id));
        }
      }
      return entry.asReadonly();
    });
  }

  public get activeTournament(): Signal<Tournament> {
    return this.lazy(this._activeTournament, () => this.getActiveTournament());
  }

  public get companies(): Signal<string []> {
    return this.lazy(this._companies, () => this.getCompanies());
  }

  public get allRegistrations(): Signal<TournamentApplication []> {
    return this.lazy(this._allRegistrations, () => this.getAllRegistrations());
  }

  public tournamentRegistrations(tournamentId: string): Signal<TournamentApplication []> {
    return this.cached(this._tourRegistrations, tournamentId, id => this.getTournamentRegistrations(id), this._loadingTourRegistrations);
  }

  public refreshTournamentRegistrations(tournamentId: string): Signal<TournamentApplication []> {
    return this.refresh(this._tourRegistrations, tournamentId, id => this.getTournamentRegistrations(id), this._loadingTourRegistrations);
  }

  public getRegistrationsCount(id: string) {
    return this.http.get<RegistrationsCount []>(`${this._apiEndpoint}/tournament/regcount?tournamentId=${id}`).subscribe(
      data => this._registrationsCount.set(data)
    );
  }

  public getCsgoRegistrations(id: string): Signal<TournamentParticipant []> {
    return this.cached(this._csgoRegistrations, id, i => this.getCSGORegistrations(i), this._loadingCSGORegistrations);
  }

  public getSc2Registrations(id: string): Signal<TournamentParticipant []> {
    return this.cached(this._sc2Registrations, id, i => this.getSC2Registrations(i), this._loadingSC2Registrations);
  }

  public refreshSc2Registrations(id: string): Signal<TournamentParticipant []> {
    return this.refresh(this._sc2Registrations, id, i => this.getSC2Registrations(i), this._loadingSC2Registrations);
  }

  public getCsgoMatches(id: string): Signal<TournamentCSGOMatch []> {
    return this.cached(this._csgoMatches, id, i => this.getCSGOMatches(i), this._loadingCSGOMatches);
  }

  public getSc2Matches(id: string): Signal<TournamentSC2Match []> {
    return this.cached(this._sc2Matches, id, i => this.getSC2Matches(i), this._loadingSC2Matches);
  }

  public refreshSc2Matches(id: string): Signal<TournamentSC2Match []> {
    return this.refresh(this._sc2Matches, id, i => this.getSC2Matches(i), this._loadingSC2Matches);
  }

  // Counter-Strike groups have always shared the registrations loading flag
  public getCsgoGroups(id: string): Signal<TournamentCSGOGroup []> {
    return this.cached(this._csgoGroups, id, i => this.getCSGOGroups(i), this._loadingCSGORegistrations);
  }

  /** StarCraft II groups are cached in reverse server order. */
  public getSc2Groups(id: string): Signal<TournamentSC2Group []> {
    return this.cached(this._sc2Groups, id, i => this.getReversedSC2Groups(i), this._loadingSC2Groups);
  }

  public refreshSc2Groups(id: string): Signal<TournamentSC2Group []> {
    return this.refresh(this._sc2Groups, id, i => this.getReversedSC2Groups(i), this._loadingSC2Groups);
  }

  public leagueRegistration(application: TournamentApplication) {
    return this.http.post<TournamentApplication>(`${this._apiEndpoint}/tournament/register`, application, { withCredentials: true }).pipe(
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public bgeRegistration(application: TournamentApplication, applicationId: string = '') {
    return this.http.put<TournamentApplication>(`${this._apiEndpoint}/tournament/registerbge?tournamentId=${applicationId}`, application, { withCredentials: true }).pipe(
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public createTournament(tournament: Tournament) {
    return this.http.put<Tournament>(`${this._apiEndpoint}/tournament/create`, tournament, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament updated successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public resetCheckinState(tournamentId: string) {
    return this.http.get(`${this._apiEndpoint}/tournament/resetstate?tournamentId=${tournamentId}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(response['message']);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public sendCheckinEmails(tournamentId: string) {
    return this.http.get(`${this._apiEndpoint}/tournament/sendcheckinemails?tournamentId=${tournamentId}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(response['message']);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public confirmRegistration(reg: TournamentApplication) {
    return this.http.put(`${this._apiEndpoint}/tournament/confirm?id=${reg.id}`, reg, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament application updated successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public weeklyCheckin(reg: TournamentApplication) {
    return this.http.put(`${this._apiEndpoint}/tournament/checkin?id=${reg.id}`, reg, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament application updated successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public deleteRegistration(id: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/delete?id=${id}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament application deleted successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Saves a Counter-Strike group and adds a newly created one to the cached groups of its tournament.
   * `tournamentId` identifies that cache when the group itself doesn't carry one.
   */
  public submitCSGOGroup(group: TournamentCSGOGroup, tournamentId = group.tournamentId) {
    return this.http.put<TournamentCSGOGroup>(`${this._apiEndpoint}/tournament/csgogroup${group.id ? '?id=' + group.id : ''}`,
      group, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament Counter-Strike group updated successfully!');
          this.addGroupToCache(this._csgoGroups, tournamentId ?? response?.tournamentId, response, 'end');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  /** Deletes a group and removes it from every cached Counter-Strike and StarCraft II group list. */
  public deleteGroup(id: string) {
    return this.http.delete<TournamentCSGOGroup>(`${this._apiEndpoint}/tournament/group?id=${id}`, { withCredentials: true}).pipe(
      tap(() => {
        this.removeGroupFromCache(this._csgoGroups, id);
        this.removeGroupFromCache(this._sc2Groups, id);
      })
    );
  }

  public addParticipantToGroup(participant: TournamentParticipant, groupid: string) {
    return this.http.put(`${this._apiEndpoint}/tournament/participanttogroup?id=${groupid}`, participant, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament participant added to group successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public removeParticipantFromGroup(participantid: string, groupid: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/participanttogroup?id=${participantid}&groupid=${groupid}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament participant deleted from group successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  /** Saves a StarCraft II group and adds a newly created one to the cached groups of its tournament. */
  public submitSC2Group(group: TournamentSC2Group) {
    return this.http.put<TournamentSC2Group>(`${this._apiEndpoint}/tournament/sc2group${group.id ? '?id=' + group.id : ''}`,
      group, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament StarCraft 2 group updated successfully!');
          // The cache holds the groups in reverse server order, so the newest group goes first
          this.addGroupToCache(this._sc2Groups, group.tournamentId ?? response?.tournamentId, response, 'start');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public submitParticipantPoints(participantid: string, groupid: string, points: number) {
    return this.http.put(`${this._apiEndpoint}/tournament/participantpoints?participantId=${participantid}&groupId=${groupid}`,
      { points },
      { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament participant points updated successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public getCSGOMatches(id: string) {
    return this.http.get<TournamentCSGOMatch []>(`${this._apiEndpoint}/tournament/csgomatches${id ? '?tournamentId=' + id : ''}`,
                                                { withCredentials: true});
  }

  public getSC2Matches(id: string) {
    return this.http.get<TournamentSC2Match []>(`${this._apiEndpoint}/tournament/sc2matches${id ? '?tournamentId=' + id : ''}`);
  }

  public submitCSGOMatch(match: TournamentCSGOMatch) {
    return this.http.put<TournamentCSGOMatch>(`${this._apiEndpoint}/tournament/csgomatch${match.id ? '?id=' + match.id : ''}`,
      match, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament Counter-Strike match updated successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public deleteCSGOMatch(match: TournamentCSGOMatch) {
    return this.http.delete<TournamentCSGOMatch>(`${this._apiEndpoint}/tournament/csgomatch?id=${match.id}`,
      { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament Counter-Strike match deleted successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  // public submitCSGOMatchMap(matchmap: TournamentCSGOMatchMap) {
  //   return this.http.put<TournamentCSGOMatchMap>(`${this._apiEndpoint}/tournament/csgomatchmap?id=${matchmap.id}`,
  //     matchmap, { withCredentials: true}).pipe(
  //       map(response => {
  //         this.commService.emitSuccess('Tournament Counter-Strike match map updated successfully!');
  //         return response;
  //       }),
  //       catchError(error => {
  //         this.commService.emitError(error.message);
  //         return throwError(() => error);
  //       })
  //     );
  // }

  public deleteCSGOMatchMap(matchmapid: string) {
    return this.http.delete<TournamentCSGOMatchMap>(`${this._apiEndpoint}/tournament/csgomatchmap?id=${matchmapid}`,
      { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament Counter-Strike match map deleted successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public submitSC2Match(match: TournamentSC2Match) {
    return this.http.put<TournamentSC2Match>(`${this._apiEndpoint}/tournament/sc2match${match.id ? '?id=' + match.id : ''}`,
      match, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament StarCraft II match updated successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public deleteSC2Match(match: TournamentSC2Match) {
    return this.http.delete<TournamentSC2Match>(`${this._apiEndpoint}/tournament/sc2match?id=${match.id}`,
      { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament StarCraft II match deleted successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  // public submitSC2MatchMap(matchmap: TournamentSC2MatchMap) {
  //   return this.http.put<TournamentSC2MatchMap>(`${this._apiEndpoint}/tournament/sc2matchmap?id=${matchmap.id}`,
  //     matchmap, { withCredentials: true}).pipe(
  //       map(response => {
  //         this.commService.emitSuccess('Tournament StarCraft II match map updated successfully!');
  //         return response;
  //       }),
  //       catchError(error => {
  //         this.commService.emitError(error.message);
  //         return throwError(() => error);
  //       })
  //     );
  // }

  public deleteSC2MatchMap(matchmapid: string) {
    return this.http.delete<TournamentSC2MatchMap>(`${this._apiEndpoint}/tournament/sc2matchmap?id=${matchmapid}`,
      { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament StarCraft II match map deleted successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public get myTournaments(): Signal<Tournament []> {
    return this.lazy(this._myTournaments,
      () => this.http.get<Tournament []>(`${this._apiEndpoint}/tournament/mytournaments`, { withCredentials: true }));
  }

  public get publicTournaments(): Signal<Tournament []> {
    return this.tournaments;
  }

  public joinByInviteCode(inviteCode: string) {
    return this.http.post<Tournament>(`${this._apiEndpoint}/tournament/join`, { inviteCode }, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Successfully joined tournament!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public deleteTournament(id: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/delete-tournament?id=${id}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament deleted successfully!');
        this._myTournaments.update(current => current ? current.filter(t => t.id !== id) : current);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public updateTournament(tournament: Tournament) {
    return this.http.put<Tournament>(`${this._apiEndpoint}/tournament/create`, tournament, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Tournament updated successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  /** Returns `target`, fetching it first when it holds no value and no request is in flight. */
  private lazy<T>(target: WritableSignal<T>, request: () => Observable<T>): Signal<T> {
    untracked(() => {
      if (!target()) {
        this.fetchInto(target, request());
      }
    });
    return target.asReadonly();
  }

  /** Returns the cache signal for `id`, fetching it the first time the id is requested. */
  private cached<T>(cache: Map<string, WritableSignal<T>>, id: string, request: (id: string) => Observable<T>,
                    loading: WritableSignal<boolean>): Signal<T> {
    return untracked(() => cache.get(id)?.asReadonly() ?? this.refresh(cache, id, request, loading));
  }

  /** Re-fetches `id` into its cache signal (creating it if needed) and returns that signal. */
  private refresh<T>(cache: Map<string, WritableSignal<T>>, id: string, request: (id: string) => Observable<T>,
                     loading: WritableSignal<boolean>): Signal<T> {
    return untracked(() => {
      let entry = cache.get(id);
      if (!entry) {
        entry = signal<T>(null);
        cache.set(id, entry);
      }
      this.fetchInto(entry, request(id), loading);
      return entry.asReadonly();
    });
  }

  private fetchInto<T>(target: WritableSignal<T>, request: Observable<T>, loading?: WritableSignal<boolean>) {
    if (this._pending.has(target)) {
      return;
    }
    this._pending.add(target);
    loading?.set(true);
    request.pipe(
      finalize(() => {
        this._pending.delete(target);
        loading?.set(false);
      })
    ).subscribe(data => target.set(data));
  }

  private addGroupToCache<T extends TournamentGroup>(cache: Map<string, WritableSignal<T []>>, tournamentId: string,
                                                     group: T, position: 'start' | 'end') {
    const entry = tournamentId ? cache.get(tournamentId) : undefined;
    if (!entry || !group) {
      return;
    }
    // Existing groups are edited in place by the admin screens, so only new ones are added
    entry.update(groups => !groups || groups.some(g => g.id === group.id)
      ? groups
      : position === 'start' ? [group, ...groups] : [...groups, group]);
  }

  private removeGroupFromCache<T extends TournamentGroup>(cache: Map<string, WritableSignal<T []>>, id: string) {
    cache.forEach(entry => entry.update(groups => groups?.some(g => g.id === id) ? groups.filter(g => g.id !== id) : groups));
  }

  private getTournamentFromServer(id: string) {
    return this.http.get<Tournament>(`${this._apiEndpoint}/tournament?id=${id}`);
  }

  private getAllRegistrations() {
    return this.http.get<TournamentApplication []>(`${this._apiEndpoint}/tournament/allregistrations`, { withCredentials: true});
  }

  private getTournamentRegistrations(tournamentId: string) {
    return this.http.get<TournamentApplication []>(`${this._apiEndpoint}/tournament/tournamentregistrations?tournamentId=${tournamentId}`, { withCredentials: true});
  }

  private getCSGORegistrations(id: string) {
    return this.http.get<TournamentParticipant []>(`${this._apiEndpoint}/tournament/csgoregs${id ? '?tournamentId=' + id : ''}`);
  }

  private getSC2Registrations(id: string) {
    return this.http.get<TournamentParticipant []>(`${this._apiEndpoint}/tournament/sc2regs${id ? '?tournamentId=' + id : ''}`);
  }

  private getCompanies() {
    return this.http.get<string []>(`${this._apiEndpoint}/companies`);
  }

  private getTournaments() {
    return this.http.get<Tournament []>(`${this._apiEndpoint}/tournament/tournaments`);
  }

  private getActiveTournament() {
    return this.http.get<Tournament>(`${this._apiEndpoint}/tournament/activetournament`);
  }

  private getCSGOGroups(id: string) {
    return this.http.get<TournamentCSGOGroup []>(`${this._apiEndpoint}/tournament/csgogroups${id ? '?tournamentId=' + id : ''}`,
                                                { withCredentials: true});
  }

  private getSC2Groups(id: string) {
    return this.http.get<TournamentSC2Group []>(`${this._apiEndpoint}/tournament/sc2groups${id ? '?tournamentId=' + id : ''}`);
  }

  private getReversedSC2Groups(id: string) {
    return this.getSC2Groups(id).pipe(map(groups => groups ? [...groups].reverse() : groups));
  }
}
