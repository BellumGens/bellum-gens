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
import { CSGOStrategy, VoteDirection, StrategyVote, StrategyComment } from '../models/csgostrategy';
import { SearchResult } from '../models/searchresult';
import { environment } from '../../environments/environment';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = environment.apiEndpoint;
  private _teamReqInProgress = false;

  // Cache
  private _currentStrategy = new BehaviorSubject<CSGOStrategy>(null);
  private _currentTeam = new BehaviorSubject<CSGOTeam>(null);
  private _players = new BehaviorSubject<CSGOPlayer []>([]);
  private _strategies = new BehaviorSubject<CSGOStrategy []>([]);
  private _currentPlayer = new BehaviorSubject<CSGOPlayer>(null);
  private _csgoTeams = new BehaviorSubject<CSGOTeam []>([]);
  private _teamApplications = new Map<string, Observable<TeamApplication[]>>();
  private _searchResultCache: Map<string, SearchResult> = new Map();
  private _playerSearchCache: Map<string, CSGOPlayer []> = new Map();
  private _teamSearchCache: Map<string, CSGOTeam []> = new Map();

  public success = new EventEmitter<string>();
  public error = new EventEmitter<string>();
  public message = new EventEmitter<string>();
  public authUserUpdate = new EventEmitter<any>();
  public loadingTeams = new ReplaySubject<boolean>(1);
  public loadingPlayers = new ReplaySubject<boolean>(1);
  public loadingStrategies = new ReplaySubject<boolean>(1);
  public loadingQuickSearch = new ReplaySubject<boolean>(1);
  public loadingSearch = new ReplaySubject<boolean>(1);
  public searchResult = new ReplaySubject<SearchResult>(1);
  public playerSearchResult = new ReplaySubject<CSGOPlayer []>(1);
  public teamSearchResult = new ReplaySubject<CSGOTeam []>(1);
  public searchTerm = new ReplaySubject<string>(1);

  constructor(private http: HttpClient) { }

  public get players() {
    if (!this._players.value.length) {
      this.loadingPlayers.next(true);
      this.getPlayers().subscribe(
        players => {
          this._players.next(players);
          this.loadingPlayers.next(false);
        },
        error => {
          this._players.next([]);
          this.loadingPlayers.next(false);
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
          this.loadingTeams.next(false);
          this.emitError(error.error.Message);
        }
      );
    }

    return this._csgoTeams;
  }

  public get strategies() {
    if (!this._strategies.value.length) {
      this.loadingStrategies.next(true);
      this.getStrategies().subscribe(
        data => {
          this._strategies.next(data);
          this.loadingStrategies.next(false);
        },
        error => {
          this.loadingStrategies.next(false);
          this.emitError(error.error.Message);
        });
    }
    return this._strategies;
  }

  public getStrategies() {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/strategies`);
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
    return this.http.get<CSGOStrategy>(`${this._apiEndpoint}/strategy/strat?stratId=${stratId}`, { withCredentials: true });
  }

  public getTeamStrats(teamId: string) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/teamstrats?teamid=${teamId}`, { withCredentials: true });
  }

  public getCurrentStrategy(stratId: string) {
    if (!this._currentStrategy.value || this._currentStrategy.value.Id !== stratId) {
      this.getTeamStrat(stratId).subscribe(strat => this._currentStrategy.next(strat));
    }
    return this._currentStrategy;
  }

  private getPlayers() {
    return this.http.get<CSGOPlayer []>(`${this._apiEndpoint}/users/users`);
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
    if (!this._teamReqInProgress) {
      if (!this._currentTeam.value || (this._currentTeam.value.TeamId !== teamId &&  this._currentTeam.value.CustomUrl !== teamId)) {
        this.checkTeamCache(teamId);
      }
      if (!this._currentTeam.value || (this._currentTeam.value.TeamId !== teamId &&  this._currentTeam.value.CustomUrl !== teamId)) {
        this.checkSearchCacheForTeam(teamId);
      }
      if (!this._currentTeam.value ||
            (this._currentTeam.value.TeamId !== teamId &&  this._currentTeam.value.CustomUrl !== teamId)) {
        this._teamReqInProgress = true;
        this.getTeamFromServer(teamId).subscribe(team => {
          this._currentTeam.next(team);
          this._teamReqInProgress = false;
        });
      }
    }
    return this._currentTeam;
  }

  private checkTeamCache(teamId) {
    const teams = this._csgoTeams.value;
    for (const team of teams) {
      if (team.CustomUrl === teamId || team.TeamId === teamId) {
        this._currentTeam.next(team);
        break;
      }
    }
  }

  private checkPlayerCache(userId) {
    const players = this._players.value;
    for (const player of players) {
      if (player.steamUser.customURL === userId || player.steamUser.steamID64 === userId) {
        this._currentPlayer.next(player);
        break;
      }
    }
  }

  private checkSearchCacheForTeam(teamId) {
    let found = false;
    this._searchResultCache.forEach((result) => {
      result.Teams.forEach((team) => {
        if (!found) {
          if (team.CustomUrl === teamId || team.TeamId === teamId) {
            this._currentTeam.next(team);
            found = true;
          }
        }
      });
    });
    if (!found) {
      this._teamSearchCache.forEach((result) => {
        result.forEach((team) => {
          if (!found) {
            if (team.CustomUrl === teamId || team.TeamId === teamId) {
              this._currentTeam.next(team);
              found = true;
            }
          }
        });
      });
    }
  }

  private checkSearchCacheForPlayer(userId) {
    let found = false;
    this._searchResultCache.forEach((result) => {
      result.Players.forEach((player) => {
        if (!found) {
          if (player.steamUser.customURL === userId || player.steamUser.steamID64 === userId) {
            this._currentPlayer.next(player);
            found = true;
          }
        }
      });
    });
    if (!found) {
      this._playerSearchCache.forEach((result) => {
        result.forEach((player) => {
          if (!found) {
            if (player.steamUser.customURL === userId || player.steamUser.steamID64 === userId) {
              this._currentPlayer.next(player);
              found = true;
            }
          }
        });
      });

    }
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
          if (response['removed']) {
            this._csgoTeams.value.splice(this._csgoTeams.value.indexOf(team), 1);
            this._csgoTeams.next(this._csgoTeams.value);
          }
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public getSteamMembers(members: string []): Observable<SteamUserSummary []> {
    return this.http.get<SteamUserSummary []>(`${this._apiEndpoint}/teams/steammembers?members=${members}`,
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
    return this.http.post(`${this._apiEndpoint}/teams/invite`,
      { userId: steamUser.steamID64, teamId: team.TeamId }, { withCredentials: true }).pipe(
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

  public submitStrategy(strat: CSGOStrategy) {
    return this.http.post<CSGOStrategy>(`${this._apiEndpoint}/strategy/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this._currentStrategy.next(response);
          this.emitSuccess('Strategy saved!');
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public submitStratVote(strat: CSGOStrategy, direction: VoteDirection, userId: string) {
    return this.http.post<StrategyVote>(`${this._apiEndpoint}/strategy/vote`,
                          { id: strat.Id, direction: direction },
                          { withCredentials: true }).pipe(
      map(response => {
        const vote = strat.Votes.find(v => v.UserId === userId);
        if (response) {
          this.emitSuccess('Vote submitted successfully!');
          if (vote) {
            vote.Vote = response.Vote;
          } else {
            strat.Votes.push(response);
          }
        } else {
          this.emitSuccess('Vote removed successfully!');
          strat.Votes.splice(strat.Votes.indexOf(vote), 1);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public submitStratComment(comment: StrategyComment, strat: CSGOStrategy) {
    return this.http.post<StrategyComment>(`${this._apiEndpoint}/strategy/comment`,
                          comment,
                          { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          const existing = strat.Comments.find(c => c.Id === response.Id);
          if (existing) {
            existing.Comment = response.Comment;
            this.emitSuccess('Comment edited successfully!');
          } else {
            strat.Comments.push(response);
            this.emitSuccess('Comment submitted successfully!');
          }
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public deleteStratComment(comment: StrategyComment, strat: CSGOStrategy) {
    return this.http.delete<StrategyComment>(`${this._apiEndpoint}/strategy/comment?id=${comment.Id}`,
                          { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.emitSuccess('Comment submitted successfully!');
          strat.Comments.splice(strat.Comments.indexOf(comment), 1);
        }
        return response;
      }),
      catchError(error => {
        this.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public deleteStrategy(id: string): Observable<any> {
    return this.http.delete(`${this._apiEndpoint}/strategy/strat?id=${id}`, { withCredentials: true }).pipe(
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

  public getPlayer(userId: string) {
    if (!this.playerMatch(userId)) {
      this.checkPlayerCache(userId);
    }
    if (!this.playerMatch(userId)) {
      this.checkSearchCacheForPlayer(userId);
    }
    if (!this.playerMatch(userId)) {
      this.getPlayerFromServer(userId).subscribe(
        player => this._currentPlayer.next(player),
        _ => this._currentPlayer.next(null)
      );
    }
    return this._currentPlayer;
  }

  private playerMatch(userId: string) {
    return this._currentPlayer.value && this._currentPlayer.value.steamUser &&
      (this._currentPlayer.value.steamUser.customURL === userId ||  this._currentPlayer.value.steamUser.steamID64 === userId);
  }

  public getPlayerFromServer(userId: string) {
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
