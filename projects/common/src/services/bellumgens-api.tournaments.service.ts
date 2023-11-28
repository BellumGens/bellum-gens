import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationService } from './communication.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { TournamentApplication,
  RegistrationsCount,
  Tournament,
  TournamentCSGOGroup,
  TournamentSC2Group,
  TournamentParticipant } from '../models/tournament';
import { TournamentCSGOMatch, TournamentSC2Match, TournamentCSGOMatchMap, TournamentSC2MatchMap } from '../models/tournament-schedule';

@Injectable({
  providedIn: 'root'
})
export class ApiTournamentsService {
  public loadingCSGORegistrations = new BehaviorSubject<boolean>(false);
  public loadingSC2Registrations = new BehaviorSubject<boolean>(false);
  public loadingCSGOMatches = new BehaviorSubject<boolean>(false);
  public loadingSC2Matches = new BehaviorSubject<boolean>(false);
  public registrationsCount = new BehaviorSubject<RegistrationsCount []>(null);

  private _apiEndpoint = environment.apiEndpoint;

  private _tournaments = new BehaviorSubject<Tournament []>(null);
  private _tournament = new BehaviorSubject<Tournament>(null);
  private _activeTournament = new BehaviorSubject<Tournament>(null);
  private _companies = new BehaviorSubject<string []>(null);
  private _allRegistrations = new BehaviorSubject<TournamentApplication []>(null);
  private _csgoRegistrations = new Map<string, BehaviorSubject<TournamentParticipant []>>();
  private _sc2Registrations = new Map<string, BehaviorSubject<TournamentParticipant []>>();
  private _csgoMatches = new Map<string, BehaviorSubject<TournamentCSGOMatch []>>();
  private _sc2Matches = new Map<string, BehaviorSubject<TournamentSC2Match []>>();
  private _csgoGroups = new Map<string, BehaviorSubject<TournamentCSGOGroup []>>();
  private _sc2Groups = new Map<string, BehaviorSubject<TournamentSC2Group []>>();

  constructor(private http: HttpClient, private commService: CommunicationService) { }

  public get tournaments() {
    if (!this._tournaments.value) {
      this.getTournaments().subscribe(data => {
        this._tournaments.next(data);
      });
    }
    return this._tournaments;
  }

  public getTournament(id: string) {
    if (this._tournaments.value) {
      this._tournament.next(this._tournaments.value.find(t => t.id === id));
    } else if (!this._tournament.value || this._tournament.value.id !== id) {
      this.getTournamentFromServer(id).subscribe(t => this._tournament.next(t));
    }
    return this._tournament;
  }

  public get activeTournament() {
    if (!this._activeTournament.value) {
      this.getActiveTournament().subscribe(data => {
        this._activeTournament.next(data);
      });
    }
    return this._activeTournament;
  }


  public get companies() {
    if (!this._companies.value) {
      this.getCompanies().subscribe(data => {
        this._companies.next(data);
      });
    }
    return this._companies;
  }

  public get allRegistrations() {
    if (!this._allRegistrations.value) {
      this.getAllRegistrations().subscribe(data => {
        this._allRegistrations.next(data);
      });
    }
    return this._allRegistrations;
  }

  public getRegistrationsCount(id: string) {
    return this.http.get<RegistrationsCount []>(`${this._apiEndpoint}/tournament/regcount?tournamentId=${id}`).subscribe(
      data => this.registrationsCount.next(data)
    );
  }

  public getCsgoRegistrations(id: string): BehaviorSubject<TournamentParticipant []> {
    if (!this._csgoRegistrations.has(id)) {
      this.loadingCSGORegistrations.next(true);
      this._csgoRegistrations.set(id, new BehaviorSubject<TournamentParticipant []>(null));
      this.getCSGORegistrations(id).subscribe({
        next: data => {
          this._csgoRegistrations.get(id).next(data);
          this.loadingCSGORegistrations.next(false);
        },
        complete: () => this.loadingCSGORegistrations.next(false)
      });
    }
    return this._csgoRegistrations.get(id);
  }

  public getSc2Registrations(id: string): BehaviorSubject<TournamentParticipant []> {
    if (!this._sc2Registrations.has(id)) {
      this.loadingSC2Registrations.next(true);
      this._sc2Registrations.set(id, new BehaviorSubject<TournamentParticipant []>(null));
      this.getSC2Registrations(id).subscribe({
        next: (data) => {
          this._sc2Registrations.get(id).next(data);
          this.loadingSC2Registrations.next(false);
        },
        complete: () => this.loadingSC2Registrations.next(false)
      });
    }
    return this._sc2Registrations.get(id);
  }

  public getCsgoMatches(id: string): BehaviorSubject<TournamentCSGOMatch []> {
    if (!this._csgoMatches.has(id)) {
      this.loadingCSGOMatches.next(true);
      this._csgoMatches.set(id, new BehaviorSubject<TournamentCSGOMatch []>(null));
      this.getCSGOMatches(id).subscribe({
        next: data => {
          this._csgoMatches.get(id).next(data);
          this.loadingCSGOMatches.next(false);
        },
        complete: () => this.loadingCSGOMatches.next(false)
      });
    }
    return this._csgoMatches.get(id);
  }

  public getSc2Matches(id: string): BehaviorSubject<TournamentSC2Match []> {
    if (!this._sc2Matches.has(id)) {
      this.loadingSC2Matches.next(true);
      this._sc2Matches.set(id, new BehaviorSubject<TournamentSC2Match []>(null));
      this.getSC2Matches(id).subscribe({
        next: (data) => {
          this._sc2Matches.get(id).next(data);
          this.loadingSC2Matches.next(false);
        },
        complete: () => this.loadingSC2Matches.next(false)
      });
    }
    return this._sc2Matches.get(id);
  }

  public getCsgoGroups(id: string): BehaviorSubject<TournamentCSGOGroup []> {
    if (!this._csgoGroups.has(id)) {
      this.loadingCSGORegistrations.next(true);
      this._csgoGroups.set(id, new BehaviorSubject<TournamentCSGOGroup []>(null));
      this.getCSGOGroups(id).subscribe({
        next: (data) => {
          this._csgoGroups.get(id).next(data);
          this.loadingCSGORegistrations.next(false);
        },
        complete: () => this.loadingCSGORegistrations.next(false)
      });
    }
    return this._csgoGroups.get(id);
  }

  public getSc2Groups(id: string): BehaviorSubject<TournamentSC2Group []> {
    if (!this._sc2Groups.has(id)) {
      this.loadingSC2Registrations.next(true);
      this._sc2Groups.set(id, new BehaviorSubject<TournamentSC2Group []>(null));
      this.getSC2Groups(id).subscribe({
        next: (data) => {
          this._sc2Groups.get(id).next(data);
          this.loadingSC2Registrations.next(false);
        },
        complete: () => this.loadingSC2Registrations.next(false)
      });
    }
    return this._sc2Groups.get(id);
  }

  public leagueRegistration(application: TournamentApplication) {
    return this.http.post<TournamentApplication>(`${this._apiEndpoint}/tournament/register`, application, { withCredentials: true }).pipe(
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

  public submitCSGOGroup(group: TournamentCSGOGroup) {
    return this.http.put<TournamentCSGOGroup>(`${this._apiEndpoint}/tournament/csgogroup${group.id ? '?id=' + group.id : ''}`,
      group, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament CS:GO group updated successfully!');
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public deleteGroup(id: string) {
    return this.http.delete<TournamentCSGOGroup>(`${this._apiEndpoint}/tournament/group?id=${id}`, { withCredentials: true});
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

  public removeParticipantFromGroup(participantid: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/participanttogroup?id=${participantid}`, { withCredentials: true }).pipe(
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

  public submitSC2Group(group: TournamentSC2Group) {
    return this.http.put<TournamentSC2Group>(`${this._apiEndpoint}/tournament/sc2group${group.id ? '?id=' + group.id : ''}`,
      group, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament CS:GO group updated successfully!');
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
    return this.http.get<TournamentSC2Match []>(`${this._apiEndpoint}/tournament/sc2matches${id ? '?tournamentId=' + id : ''}`,
                                                { withCredentials: true});
  }

  public submitCSGOMatch(match: TournamentCSGOMatch) {
    return this.http.put<TournamentCSGOMatch>(`${this._apiEndpoint}/tournament/csgomatch${match.id ? '?id=' + match.id : ''}`,
      match, { withCredentials: true}).pipe(
        map(response => {
          this.commService.emitSuccess('Tournament CS:GO match updated successfully!');
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
          this.commService.emitSuccess('Tournament CS:GO match deleted successfully!');
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
  //         this.commService.emitSuccess('Tournament CS:GO match map updated successfully!');
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
          this.commService.emitSuccess('Tournament CS:GO match map deleted successfully!');
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

  private getTournamentFromServer(id: string) {
    return this.http.get<Tournament>(`${this._apiEndpoint}/tournament?id=${id}`);
  }

  private getAllRegistrations() {
    return this.http.get<TournamentApplication []>(`${this._apiEndpoint}/tournament/allregistrations`, { withCredentials: true});
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
    return this.http.get<TournamentSC2Group []>(`${this._apiEndpoint}/tournament/sc2groups${id ? '?tournamentId=' + id : ''}`,
                                                { withCredentials: true});
  }
}
