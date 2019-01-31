import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup, SteamUser } from '../models/steamuser';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { CSGOTeam, TeamMember, TeamApplication, TeamSearch } from '../models/csgoteam';
import { CSGOPlayer, PlayerSearch } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { MapPool } from 'src/app/models/csgomaps';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { UserNotification } from '../models/usernotifications';
import { TeamStrategy } from '../models/csgoteamstrategy';
import { SearchResult } from '../models/searchresult';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api';

  private _players: ReplaySubject<CSGOPlayer []>;
  private _csgoTeams: ReplaySubject<CSGOTeam []>;
  private _teamApplications = new Map<string, Observable<TeamApplication[]>>();
  public success = new EventEmitter<string>();
  public error = new EventEmitter<string>();
  public loadingTeams = new ReplaySubject<boolean>(1);
  public loadingPlayers = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) { }

  public get players() {
    if (!this._players) {
      this.loadingPlayers.next(true);
      this._players = new ReplaySubject<CSGOPlayer []>(1);
      this.getPlayers().subscribe(
        players => {
          this._players.next(players);
          this.loadingPlayers.next(false);
        },
        error => {
          this._players.next([]);
          this.emitError(error.error.Message);
        }
      );
    }

    return this._players;
  }

  public get csgoTeams() {
    if (!this._csgoTeams) {
      this.loadingTeams.next(true);
      this._csgoTeams = new ReplaySubject<CSGOTeam []>(1);
      this.getTeams().subscribe(
        teams => {
          this._csgoTeams.next(teams);
          this.loadingTeams.next(false);
        },
        error => {
          this._csgoTeams.next([]);
          this.emitError(error.error.Message);
        }
      );
    }

    return this._csgoTeams.asObservable();
  }

  public quickSearch(name: string) {
    return this.http.get<SearchResult>(`${this._apiEndpoint}/search/search?name=${name}`).pipe(
      map(response => response),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public searchTeams(model: TeamSearch) {
    this._csgoTeams.next([]);
    this.loadingTeams.next(true);
    this.getFilteredTeams(model).subscribe(
      teams => {
        this._csgoTeams.next(teams);
        this.loadingTeams.next(false);
      },
      error => {
        this.emitError(error.error.Message);
      }
    );
  }

  public searchPlayers(model: PlayerSearch) {
    this._players.next([]);
    this.loadingPlayers.next(true);
    this.getFilteredPlayers(model).subscribe(
      players => {
        this._players.next(players);
        this.loadingPlayers.next(false);
      },
      error => {
        this.emitError(error.error.Message);
      }
    );
  }

  public emitError(error: string) {
    this.error.emit(error);
  }

  public emitSuccess(success: string) {
    this.success.emit(success);
  }

  public teamApplications(teamId: string): Observable<TeamApplication []> {
    if (!this._teamApplications[teamId]) {
      this._teamApplications[teamId] = this.getTeamApplications(teamId).pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this._teamApplications[teamId];
  }

  public getTeamStrats(teamId: string) {
    return this.http.get<TeamStrategy []>(`${this._apiEndpoint}/teams/strats?teamid=${teamId}`, { withCredentials: true });
  }

  private getPlayers() {
    return this.http.get<CSGOPlayer []>(`${this._apiEndpoint}/users/users`).pipe(
      map(response => response)
    );
  }

  private getFilteredPlayers(model: PlayerSearch) {
    return this.http.post<CSGOPlayer []>(`${this._apiEndpoint}/search/players`, model, { withCredentials: true });
  }

  private getTeams() {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/teams/teams`).pipe(
      map(response => response)
    );
  }

  private getFilteredTeams(model: TeamSearch) {
    return this.http.post<CSGOTeam []>(`${this._apiEndpoint}/search/teams`, model, { withCredentials: true });
  }

  public getTeam(teamId: string): Observable<CSGOTeam> {
    return this.http.get<CSGOTeam>(`${this._apiEndpoint}/teams/team?teamid=${teamId}`);
  }

  public registerSteamGroup(group: SteamGroup) {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/team`, group, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${group.groupName} registered successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public registerTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/newteam`, team, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${team.TeamName} registered successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public updateTeamMember(teamMember: TeamMember) {
    return this.http.put(`${this._apiEndpoint}/teams/member`, teamMember, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${teamMember.SteamUser.steamID} updated successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public removeTeamMember(teamMember: TeamMember) {
    return this.http.delete(`${this._apiEndpoint}/teams/removemember?teamId=${teamMember.TeamId}&userId=${teamMember.UserId}`,
              { withCredentials: true }).pipe(
                map(response => {
                  if (response) {
                    this.emitSuccess(`${teamMember.SteamUser.steamID} removed from team!`);
                  }
                  return response;
                }),
                catchError(error => {
                  this.emitError(error.error.Message);
                  return throwError(error);
                })
              );
  }

  public abandonTeam(team: CSGOTeam) {
    return this.http.delete(`${this._apiEndpoint}/teams/abandon?teamId=${team.TeamId}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`You're are no longer part of ${team.TeamName}`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public inviteToTeam(steamUser: SteamUser, team: CSGOTeam) {
    return this.http.post(`${this._apiEndpoint}/teams/invite?userId=${steamUser.steamID64}`, team, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${steamUser.steamID} successfully invited to ${team.TeamName}`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public submitApplication(application: TeamApplication) {
    return this.http.post(`${this._apiEndpoint}/teams/apply`, application, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`Application submitted successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public getTeamApplications(teamId: string): Observable<TeamApplication []> {
    return this.http.get<TeamApplication []>(`${this._apiEndpoint}/teams/applications?teamId=${teamId}`, { withCredentials: true });
  }

  public approveApplication(application: TeamApplication): Observable<TeamApplication> {
    return this.http.put<TeamApplication>(`${this._apiEndpoint}/teams/approveapplication`, application, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${application.UserInfo.steamID} is now part of your team!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public rejectApplication(application: TeamApplication): Observable<TeamApplication> {
    return this.http.put<TeamApplication>(`${this._apiEndpoint}/teams/rejectapplication`, application, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${application.UserInfo.steamID} application has been rejected!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public getTeamMapPool(teamId: string): Observable<MapPool []> {
    return this.http.get<MapPool []>(`${this._apiEndpoint}/teams/mapPool?teamId=${teamId}`, { withCredentials: true });
  }

  public setTeamMapPool(mapstatus: MapPool []): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/teams/mapPool`, mapstatus, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Map selection saved!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public submitStrategy(strat: TeamStrategy): Observable<any> {
    return this.http.post(`${this._apiEndpoint}/teams/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('New strategy successfully submitted!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public setTeamPractice(day: Availability) {
    return this.http.put(`${this._apiEndpoint}/teams/availability`, day, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Practice schedule updated!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public getPlayer(userId: string): Observable<CSGOPlayer> {
    return this.http.get<CSGOPlayer>(`${this._apiEndpoint}/users/user?userid=${userId}`).pipe(
      map(response => {
        if (response.userStatsException) {
          this.emitError('Account is private!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public setAvailability(availability: Availability): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/availability`, availability, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Availability updated!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public setPrimaryRole(role: Role): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/primaryrole`, role, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`Primary role set to ${role.Name}`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public setSecondaryRole(role: Role): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/secondaryrole`, role, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`Secondary role set to ${role.Name}`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public setMapPool(mapstatus: MapPool): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/mapPool`, mapstatus, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Map pool updated!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public acceptInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/acceptTeamInvite`, notification, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Team invite accepted!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public rejectInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/rejectTeamInvite`, notification, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Team invite rejected!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }
}
