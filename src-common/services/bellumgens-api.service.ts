import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup, SteamUser } from '../models/steamuser';
import { Observable, ReplaySubject, throwError, BehaviorSubject } from 'rxjs';
import { CSGOTeam, TeamMember, TeamApplication } from '../models/csgoteam';
import { CSGOPlayer } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { CSGOMapPool } from '../models/csgomaps';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { UserNotification } from '../models/usernotifications';
import { CSGOStrategy, VoteDirection, StrategyVote, StrategyComment } from '../models/csgostrategy';
import { environment } from '../environments/environment';
import { CommunicationService } from './communication.service';
import { Tournament } from '../models/tournament';

const CACHE_SIZE = 1;
const PAGE_SIZE = 25;

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = environment.apiEndpoint;
  private _teamReqInProgress = false;

  // Cache
  private _currentStrategy = new BehaviorSubject<CSGOStrategy>(null);
  private _currentTeam = new BehaviorSubject<CSGOTeam>(null);
  private _currentTeamMembers = new BehaviorSubject<TeamMember []>(null);
  private _currentTeamPractice = new BehaviorSubject<Availability []>(null);
  private _strategies = new BehaviorSubject<CSGOStrategy []>([]);
  private _currentPlayer = new BehaviorSubject<CSGOPlayer>(null);
  private _teamApplications = new Map<string, Observable<TeamApplication[]>>();

  public hasMoreStrats = new ReplaySubject<boolean>(CACHE_SIZE);
  public loadingTeams = new ReplaySubject<boolean>(CACHE_SIZE);
  public loadingPlayers = new ReplaySubject<boolean>(CACHE_SIZE);
  public loadingStrategies = new ReplaySubject<boolean>(CACHE_SIZE);
  public loadingPlayer = new ReplaySubject<boolean>(CACHE_SIZE);

  constructor(private http: HttpClient, private commService: CommunicationService) { }

  public get strategies() {
    if (!this._strategies.value.length) {
      this.loadingStrategies.next(true);
      this.getStrategies().subscribe(
        data => {
          this._strategies.next(data);
          this.loadingStrategies.next(false);
          this.hasMoreStrats.next(data.length === PAGE_SIZE);
        },
        error => {
          this.loadingStrategies.next(false);
          this.commService.emitError(error.error);
        });
    }
    return this._strategies;
  }

  private getStrategies(page: number = 0) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/strategies?page=${page}`);
  }

  public loadStrategiesPage(page: number) {
    this.getStrategies(page).subscribe(
      data => {
        this._strategies.next(this._strategies.value.concat(data));
        this.loadingStrategies.next(false);
        this.hasMoreStrats.next(data.length === PAGE_SIZE);
      },
      error => {
        this.loadingStrategies.next(false);
        this.commService.emitError(error.error);
      }
    );
  }

  public getUserStrategies(userId: string) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/userstrats?userid=${userId}`, { withCredentials: true });
  }

  public getUserTeams(userId: string) {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/users/userteams?userid=${userId}`, { withCredentials: true });
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
    if (!this._currentStrategy.value || this._currentStrategy.value.id !== stratId) {
      this.getTeamStrat(stratId).subscribe(strat => this._currentStrategy.next(strat));
    }
    return this._currentStrategy;
  }

  public getTeam(teamId: string) {
    if (!this._teamReqInProgress) {
      if (!this._currentTeam.value || this._currentTeam.value.teamId !== teamId || this._currentTeam.value.customUrl !== teamId) {
        this._teamReqInProgress = true;
        this.getTeamFromServer(teamId).subscribe(team => {
          this._currentTeam.next(team);
          this._teamReqInProgress = false;
        });
      }
    }
    return this._currentTeam;
  }

  public getTeamMembers(teamId: string) {
    if (!this._currentTeamMembers.value || this._currentTeam.value.teamId !== teamId || this._currentTeam.value.customUrl !== teamId) {
      this.getTeamMembersFromServer(teamId).subscribe(members => {
        this._currentTeamMembers.next(members);
      });
    }
    return this._currentTeamMembers;
  }

  public getTeamSchedule(teamId: string) {
    if (!this._currentTeamPractice.value || this._currentTeam.value.teamId !== teamId || this._currentTeam.value.customUrl !== teamId) {
      this.getTeamPractice(teamId).subscribe(schedule => {
        this._currentTeamPractice.next(schedule);
      });
    }
    return this._currentTeamPractice;
  }

  private getTeamFromServer(teamId: string) {
    return this.http.get<CSGOTeam>(`${this._apiEndpoint}/teams?teamid=${teamId}`);
  }

  private getTeamMembersFromServer(teamId: string) {
    return this.http.get<TeamMember []>(`${this._apiEndpoint}/teams/members?teamid=${teamId}`);
  }

  public registerSteamGroup(group: SteamGroup) {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/team`, group, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`${group.groupName} registered successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public registerTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/newteam`, team, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`${team.teamName} registered successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public updateTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.put<CSGOTeam>(`${this._apiEndpoint}/teams/team`, team, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`${team.teamName} updated successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public updateTeamMember(teamMember: TeamMember): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this._apiEndpoint}/teams/member`, teamMember, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`${teamMember.username} updated successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public removeTeamMember(teamMember: TeamMember) {
    return this.http.delete(`${this._apiEndpoint}/teams/removemember?teamId=${teamMember.teamId}&userId=${teamMember.userId}`,
      { withCredentials: true }).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess(`${teamMember.username} removed from team!`);
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
      );
  }

  public abandonTeam(team: CSGOTeam) {
    return this.http.delete(`${this._apiEndpoint}/teams/abandon?teamId=${team.teamId}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`You're are no longer part of ${team.teamName}`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public inviteToTeam(steamUser: SteamUser, team: CSGOTeam) {
    return this.http.post(`${this._apiEndpoint}/teams/invite`,
      { userId: steamUser.steamID64, teamId: team.teamId }, { withCredentials: true }).pipe(
        map(response => {
          if (response) {
            this.commService.emitSuccess(`${steamUser.steamID} successfully invited to ${team.teamName}`);
          }
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.error);
          return throwError(error);
        })
    );
  }

  public submitApplication(application: TeamApplication) {
    return this.http.post(`${this._apiEndpoint}/teams/apply`, application, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`Application submitted successfully!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
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
          this.commService.emitSuccess(`${application.userName} is now part of your team!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public rejectApplication(application: TeamApplication): Observable<TeamApplication> {
    return this.http.put<TeamApplication>(`${this._apiEndpoint}/teams/rejectapplication`, application, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`${application.userName} application has been rejected!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getTeamMapPool(teamId: string): Observable<CSGOMapPool []> {
    return this.http.get<CSGOMapPool []>(`${this._apiEndpoint}/teams/mapPool?teamId=${teamId}`, { withCredentials: true });
  }

  public setTeamMapPool(mapstatus: CSGOMapPool []): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/teams/mapPool`, mapstatus, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Map selection saved!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getTeamTournaments(teamid: string) {
    return this.http.get<Tournament []>(`${this._apiEndpoint}/teams/tournaments?teamid=${teamid}`);
  }

  public submitStrategy(strat: CSGOStrategy) {
    return this.http.post<CSGOStrategy>(`${this._apiEndpoint}/strategy/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this._currentStrategy.next(response);
          this.commService.emitSuccess('Strategy saved!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public submitStratVote(strat: CSGOStrategy, direction: VoteDirection, userId: string) {
    return this.http.post<StrategyVote>(`${this._apiEndpoint}/strategy/vote`,
                          { id: strat.id, direction: direction },
                          { withCredentials: true }).pipe(
      map(response => {
        const vote = strat.votes.find(v => v.userId === userId);
        if (response) {
          this.commService.emitSuccess('Vote submitted successfully!');
          if (vote) {
            vote.vote = response.vote;
          } else {
            strat.votes.push(response);
          }
        } else {
          this.commService.emitSuccess('Vote removed successfully!');
          strat.votes.splice(strat.votes.indexOf(vote), 1);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
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
          const existing = strat.comments.find(c => c.id === response.id);
          if (existing) {
            existing.comment = response.comment;
            this.commService.emitSuccess('Comment edited successfully!');
          } else {
            strat.comments.push(response);
            this.commService.emitSuccess('Comment submitted successfully!');
          }
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public deleteStratComment(comment: StrategyComment, strat: CSGOStrategy) {
    return this.http.delete<StrategyComment>(`${this._apiEndpoint}/strategy/comment?id=${comment.id}`,
                          { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Comment submitted successfully!');
          strat.comments.splice(strat.comments.indexOf(comment), 1);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public deleteStrategy(id: string): Observable<any> {
    return this.http.delete(`${this._apiEndpoint}/strategy/strat?id=${id}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Strategy successfully deleted!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getTeamPractice(teamid: string) {
    return this.http.get<Availability []>(`${this._apiEndpoint}/teams/availability?teamid=${teamid}`);
  }

  public setTeamPractice(day: Availability) {
    return this.http.put(`${this._apiEndpoint}/teams/availability`, day, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Practice schedule updated!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getPlayer(userId: string) {
    if (!this.playerMatch(userId)) {
      this.loadingPlayer.next(true);
      this.getPlayerFromServer(userId).subscribe(
        player => {
          this._currentPlayer.next(player);
          this.loadingPlayer.next(false);
        },
        _ => {
          this._currentPlayer.next(null);
          this.loadingPlayer.next(false);
        }
      );
    }
    return this._currentPlayer;
  }

  public getPlayerGroups(userId: string) {
    return this.http.get<SteamGroup []>(`${this._apiEndpoint}/users/usergroups?userid=${userId}`);
  }

  private playerMatch(userId: string) {
    return this._currentPlayer.value && this._currentPlayer.value.steamUser &&
      (this._currentPlayer.value.steamUser.customURL === userId ||  this._currentPlayer.value.steamUser.steamID64 === userId);
  }

  public getPlayerFromServer(userId: string) {
    return this.http.get<CSGOPlayer>(`${this._apiEndpoint}/users?userid=${userId}`).pipe(
      map(response => {
        if (response.userStatsException) {
          this.commService.emitError('Account is private!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getAvailability(userid: string): Observable<Availability []> {
    return this.http.get<Availability []>(`${this._apiEndpoint}/users/availability?userid=${userid}`);
  }

  public setAvailability(availability: Availability): Observable<Availability> {
    return this.http.put<Availability>(`${this._apiEndpoint}/users/availability`, availability, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Availability updated!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public setPrimaryRole(role: Role): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/primaryrole?id=${role.id}`, role, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`Primary role set to ${role.name}`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public setSecondaryRole(role: Role): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/secondaryrole?id=${role.id}`, role, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(`Secondary role set to ${role.name}`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public getMapPool(userid: string): Observable<CSGOMapPool []> {
    return this.http.get<CSGOMapPool []>(`${this._apiEndpoint}/users/mapPool?userid=${userid}`);
  }

  public setMapPool(mapstatus: CSGOMapPool): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/mapPool`, mapstatus, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Map pool updated!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public acceptInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/acceptTeamInvite`, notification, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Team invite accepted!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public rejectInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/rejectTeamInvite`, notification, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Team invite rejected!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }
}
