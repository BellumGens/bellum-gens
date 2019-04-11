import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup, SteamUser, SteamUserSummary } from '../models/steamuser';
import { Observable, ReplaySubject, throwError, BehaviorSubject } from 'rxjs';
import { CSGOTeam, TeamMember, TeamApplication } from '../models/csgoteam';
import { CSGOPlayer } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { MapPool } from '../models/csgomaps';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { UserNotification } from '../models/usernotifications';
import { TeamStrategy } from '../models/csgoteamstrategy';
import { SearchResult } from '../models/searchresult';
import { environment } from '../../environments/environment';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = environment.apiEndpoint;

  public success = new EventEmitter<string>();
  public error = new EventEmitter<string>();
  public message = new EventEmitter<string>();
  public authUserUpdate = new EventEmitter<any>();
  public loadingTeams = new ReplaySubject<boolean>(1);
  public loadingPlayers = new ReplaySubject<boolean>(1);
  public loadingQuickSearch = new ReplaySubject<boolean>(1);
  public loadingSearch = new ReplaySubject<boolean>(1);
  public searchResult = new ReplaySubject<SearchResult>(1);
  public playerSearchResult = new ReplaySubject<CSGOPlayer []>(1);
  public teamSearchResult = new ReplaySubject<CSGOTeam []>(1);
  public searchTerm = new ReplaySubject<string>(1);

  // Cache
  private _currentStrategy = new BehaviorSubject<TeamStrategy>(null);
  private _currentTeam = new BehaviorSubject<CSGOTeam>(null);
  private _players: ReplaySubject<CSGOPlayer []>;
  private _csgoTeams = new BehaviorSubject<CSGOTeam []>([]);
  private _teamApplications = new Map<string, Observable<TeamApplication[]>>();
  private _searchResultCache: Map<string, SearchResult> = new Map();
  private _playerSearchCache: Map<string, CSGOPlayer []> = new Map();
  private _teamSearchCache: Map<string, CSGOTeam []> = new Map();

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
    if (!this._csgoTeams.value.length) {
      this.loadingTeams.next(true);
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

    return this._csgoTeams;
  }

  public quickSearch(name: string) {
    this.searchTerm.next(name);
    if (this._searchResultCache.has(name)) {
      this.searchResult.next(this._searchResultCache.get(name));
    } else {
      this.loadingQuickSearch.next(true);
      this.getQuickSearch(name).subscribe(
        data => {
          this._searchResultCache.set(name, data);
          this.searchResult.next(data);
          this.loadingQuickSearch.next(false);
        }
      );
    }
  }

  private getQuickSearch(name: string) {
    return this.http.get<SearchResult>(`${this._apiEndpoint}/search/search?name=${name}`).pipe(
      map(response => response),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public searchTeams(query: string) {
    if (this._teamSearchCache.has(query)) {
      this.teamSearchResult.next(this._teamSearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this.teamSearchResult.next(this._searchResultCache.get(val).Teams);
        }
      } else {
        this.teamSearchResult.next([]);
        this.loadingSearch.next(true);
        this.getFilteredTeams(query).subscribe(
          teams => {
            this._teamSearchCache.set(query, teams);
            this.teamSearchResult.next(teams);
            this.loadingSearch.next(false);
          },
          error => {
            this.emitError(error.error.Message);
          }
        );
      }
    }
  }

  public searchPlayers(query: string) {
    if (this._playerSearchCache.has(query)) {
      this.playerSearchResult.next(this._playerSearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this.playerSearchResult.next(this._searchResultCache.get(val).Players);
        }
      } else {
        this.playerSearchResult.next([]);
        this.loadingSearch.next(true);
        this.getFilteredPlayers(query).subscribe(
          players => {
            this._playerSearchCache.set(query, players);
            this.playerSearchResult.next(players);
            this.loadingSearch.next(false);
          },
          error => {
            this.emitError(error.error.Message);
          }
        );
      }
    }
  }

  public emitError(error: string) {
    this.error.emit(error);
  }

  public emitSuccess(success: string) {
    this.success.emit(success);
  }

  public emitMessage(message: string) {
    this.message.emit(message);
  }

  public teamApplications(teamId: string): Observable<TeamApplication []> {
    if (!this._teamApplications[teamId]) {
      this._teamApplications[teamId] = this.getTeamApplications(teamId).pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this._teamApplications[teamId];
  }

  public getTeamStrat(stratId: string) {
    return this.http.get<TeamStrategy>(`${this._apiEndpoint}/teams/strat?stratId=${stratId}`, { withCredentials: true });
  }

  public getTeamStrats(teamId: string) {
    return this.http.get<TeamStrategy []>(`${this._apiEndpoint}/teams/strats?teamid=${teamId}`, { withCredentials: true });
  }

  public getCurrentStrategy(stratId: string) {
    if (!this._currentStrategy.value) {
      this.getTeamStrat(stratId).subscribe(strat => this._currentStrategy.next(strat));
    }
    return this._currentStrategy;
  }

  private getPlayers() {
    return this.http.get<CSGOPlayer []>(`${this._apiEndpoint}/users/users`).pipe(
      map(response => response)
    );
  }

  private getFilteredPlayers(query: string) {
    return this.http.get<CSGOPlayer []>(`${this._apiEndpoint}/search/players?${query}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  private getTeams() {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/teams/teams`);
  }

  private getFilteredTeams(query: string) {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/search/teams?${query}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public getTeam(teamId: string) {
    if (!this._currentTeam.value || this._currentTeam.value.TeamId !== teamId) {
      this.checkTeamCache(teamId);
    }
    if (!this._currentTeam.value || this._currentTeam.value.TeamId !== teamId) {
      this.checkSearchCache(teamId);
    }
    if (!this._currentTeam.value || this._currentTeam.value.TeamId !== teamId) {
      this.getTeamFromServer(teamId).subscribe(team => this._currentTeam.next(team));
    }
    return this._currentTeam;
  }

  private checkTeamCache(teamId) {
    this._csgoTeams.value.forEach((team) => {
      if (team.TeamId === teamId) {
        this._currentTeam.next(team);
      }
    });
  }

  private checkSearchCache(teamId) {
    this._searchResultCache.forEach((result) => {
      result.Teams.forEach((team) => {
        if (team.TeamId === teamId) {
          this._currentTeam.next(team);
        }
      });
    });
    this._teamSearchCache.forEach((result) => {
      result.forEach((team) => {
        if (team.TeamId === teamId) {
          this._currentTeam.next(team);
        }
      });
    });
  }

  private getTeamFromServer(teamId: string) {
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

  public updateTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.put<CSGOTeam>(`${this._apiEndpoint}/teams/team`, team, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess(`${team.TeamName} updated successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public updateTeamMember(teamMember: TeamMember): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this._apiEndpoint}/teams/member`, teamMember, { withCredentials: true }).pipe(
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

  public getSteamMembers(teamid: string, members: string []): Observable<SteamUserSummary []> {
    return this.http.get<SteamUserSummary []>(`${this._apiEndpoint}/teams/steammembers?teamId=${teamid}&members=${members}`,
      { withCredentials: true }).pipe(
        map(response => {
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

  public submitStrategy(strat: TeamStrategy) {
    return this.http.post<TeamStrategy>(`${this._apiEndpoint}/teams/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this._currentStrategy.next(response);
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

  public deleteStrategy(id: string, teamid: string): Observable<any> {
    return this.http.delete(`${this._apiEndpoint}/teams/strategy?id=${id}&teamid=${teamid}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Strategy successfully deleted!');
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
          this.authUserUpdate.emit();
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
          this.authUserUpdate.emit();
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
          this.authUserUpdate.emit();
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
          this.authUserUpdate.emit();
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
