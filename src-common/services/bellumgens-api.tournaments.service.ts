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
  TournamentRegistration } from '../models/tournament';
import { TournamentCSGOMatch, TournamentSC2Match, TournamentCSGOMatchMap, TournamentSC2MatchMap } from '../models/tournament-schedule';

@Injectable({
  providedIn: 'root'
})
export class ApiTournamentsService {
  private _apiEndpoint = environment.apiEndpoint;

  private _tournaments = new BehaviorSubject<Tournament []>(null);
  private _activeTournament = new BehaviorSubject<Tournament>(null);
  private _companies = new BehaviorSubject<string []>(null);
  private _allRegistrations = new BehaviorSubject<TournamentApplication []>(null);
  private _csgoRegistrations = new BehaviorSubject<TournamentRegistration []>(null);
  private _sc2Registrations = new BehaviorSubject<TournamentRegistration []>(null);

  private _csgoMatches = new BehaviorSubject<TournamentCSGOMatch []>(null);
  private _sc2Matches = new BehaviorSubject<TournamentSC2Match []>(null);

  public loadingCSGORegistrations = new BehaviorSubject<boolean>(false);
  public loadingSC2Registrations = new BehaviorSubject<boolean>(false);
  public loadingCSGOMatches = new BehaviorSubject<boolean>(false);
  public loadingSC2Matches = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private commService: CommunicationService) { }

  public get tournaments() {
    if (!this._tournaments.value) {
      this.getTournaments().subscribe(data => {
        this._tournaments.next(data);
      });
    }
    return this._tournaments;
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

  public registrationsCount = new BehaviorSubject<RegistrationsCount []>(null);

  public getRegistrationsCount(id: string) {
    return this.http.get<RegistrationsCount []>(`${this._apiEndpoint}/tournament/regcount?tournamentId=${id}`).subscribe(
      data => this.registrationsCount.next(data)
    );
  }

  public get csgoRegistrations() {
    if (!this._csgoRegistrations.value) {
      this.loadingCSGORegistrations.next(true);
      this.getCSGORegistrations().subscribe(data => {
          this._csgoRegistrations.next(data);
          this.loadingCSGORegistrations.next(false);
        },
        _ => this.loadingCSGORegistrations.next(false)
      );
    }
    return this._csgoRegistrations;
  }

  public get sc2Registrations() {
    if (!this._sc2Registrations.value) {
      this.loadingSC2Registrations.next(true);
      this.getSC2Registrations().subscribe(data => {
          this._sc2Registrations.next(data);
          this.loadingSC2Registrations.next(false);
        },
        _ => this.loadingSC2Registrations.next(false)
      );
    }
    return this._sc2Registrations;
  }

  public get csgoMatches() {
    if (!this._csgoMatches.value) {
      this.loadingCSGOMatches.next(true);
      this.getCSGOMatches().subscribe(data => {
          this._csgoMatches.next(data);
          this.loadingCSGOMatches.next(false);
        },
        _ => this.loadingCSGOMatches.next(false)
      );
    }
    return this._csgoMatches;
  }

  public get sc2Matches() {
    if (!this._sc2Matches.value) {
      this.loadingSC2Matches.next(true);
      this.getSC2Matches().subscribe(data => {
          this._sc2Matches.next(data);
          this.loadingSC2Matches.next(false);
        },
        _ => this.loadingSC2Matches.next(false)
      );
    }
    return this._sc2Matches;
  }

  public addSubscriber(email: string) {
    return this.http.post(`${this._apiEndpoint}/account/subscribe`, { Email: email }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(response.toString());
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public leagueRegistration(application: TournamentApplication) {
    return this.http.post<TournamentApplication>(`${this._apiEndpoint}/tournament/register`, application, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public createTournament(tournament: Tournament) {
    return this.http.put<Tournament>(`${this._apiEndpoint}/tournament/create`, tournament, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public confirmRegistration(reg: TournamentApplication) {
    return this.http.put(`${this._apiEndpoint}/tournament/confirm?id=${reg.Id}`, reg, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Tournament application updated successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public deleteRegistration(id: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/delete?id=${id}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Tournament application deleted successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getCSGOGroups() {
    return this.http.get<TournamentCSGOGroup []>(`${this._apiEndpoint}/tournament/csgogroups`, { withCredentials: true});
  }

  public submitCSGOGroup(group: TournamentCSGOGroup) {
    return this.http.put<TournamentCSGOGroup>(`${this._apiEndpoint}/tournament/csgogroup?id=${group.Id || null}`,
      group, { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO group updated successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public deleteGroup(id: string) {
    return this.http.delete<TournamentCSGOGroup>(`${this._apiEndpoint}/tournament/group?id=${id}`, { withCredentials: true});
  }

  public addParticipantToGroup(participant: TournamentRegistration, groupid: string) {
    return this.http.put(`${this._apiEndpoint}/tournament/participanttogroup?id=${groupid}`, participant, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Tournament participant added to group successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public removeParticipantFromGroup(participantid: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/participanttogroup?id=${participantid}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Tournament participant deleted from group successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getSC2Groups() {
    return this.http.get<TournamentSC2Group []>(`${this._apiEndpoint}/tournament/sc2groups`, { withCredentials: true});
  }

  public submitSC2Group(group: TournamentSC2Group) {
    return this.http.put<TournamentSC2Group>(`${this._apiEndpoint}/tournament/sc2group?id=${group.Id || null}`,
      group, { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO group updated successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public getCSGOMatches() {
    return this.http.get<TournamentCSGOMatch []>(`${this._apiEndpoint}/tournament/csgomatches`, { withCredentials: true});
  }

  public getSC2Matches() {
    return this.http.get<TournamentSC2Match []>(`${this._apiEndpoint}/tournament/sc2matches`, { withCredentials: true});
  }

  public submitCSGOMatch(match: TournamentCSGOMatch) {
    return this.http.put<TournamentCSGOMatch>(`${this._apiEndpoint}/tournament/csgomatch?id=${match.Id || null}`,
      match, { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO match updated successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public deleteCSGOMatch(match: TournamentCSGOMatch) {
    return this.http.delete<TournamentCSGOMatch>(`${this._apiEndpoint}/tournament/csgomatch?id=${match.Id}`,
      { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO match deleted successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public submitCSGOMatchMap(matchmap: TournamentCSGOMatchMap) {
    return this.http.put<TournamentCSGOMatchMap>(`${this._apiEndpoint}/tournament/csgomatchmap?id=${matchmap.Id || null}`,
      matchmap, { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO match map updated successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public deleteCSGOMatchMap(matchmapid: string) {
    return this.http.delete<TournamentCSGOMatchMap>(`${this._apiEndpoint}/tournament/csgomatchmap?id=${matchmapid}`,
      { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO match map deleted successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public submitSC2Match(match: TournamentSC2Match) {
    return this.http.put<TournamentSC2Match>(`${this._apiEndpoint}/tournament/sc2match?id=${match.Id || null}`,
      match, { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament StarCraft II match updated successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public deleteSC2Match(match: TournamentSC2Match) {
    return this.http.delete<TournamentSC2Match>(`${this._apiEndpoint}/tournament/sc2match?id=${match.Id}`,
      { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament StarCraft II match deleted successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public submitSC2MatchMap(matchmap: TournamentSC2MatchMap) {
    return this.http.put<TournamentSC2MatchMap>(`${this._apiEndpoint}/tournament/sc2matchmap?id=${matchmap.Id || null}`,
      matchmap, { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO match map updated successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public deleteSC2MatchMap(matchmapid: string) {
    return this.http.delete<TournamentSC2MatchMap>(`${this._apiEndpoint}/tournament/sc2matchmap?id=${matchmapid}`,
      { withCredentials: true}).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess('Tournament CS:GO match map deleted successfully!');
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  private getAllRegistrations() {
    return this.http.get<TournamentApplication []>(`${this._apiEndpoint}/tournament/allregistrations`, { withCredentials: true});
  }

  private getCSGORegistrations() {
    return this.http.get<TournamentRegistration []>(`${this._apiEndpoint}/tournament/csgoregs`);
  }

  private getSC2Registrations() {
    return this.http.get<TournamentRegistration []>(`${this._apiEndpoint}/tournament/sc2regs`);
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
}
