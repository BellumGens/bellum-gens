import { Injectable, Signal, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup, SteamUser } from '../models/steamuser';
import { Observable, throwError } from 'rxjs';
import { CSGOTeam, TeamMember, TeamApplication } from '../models/csgoteam';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { CSGOMapPool } from '../models/csgomaps';
import { CSGODetails } from '../models/csgoplayer';
import { map, catchError } from 'rxjs/operators';
import { UserNotification } from '../models/usernotifications';
import { environment } from '../environments/environment';
import { CommunicationService } from './communication.service';
import { Tournament } from '../models/tournament';
import { ApplicationUser } from '../models/applicationuser';
import { EarlyBird } from '../models/subscribers';

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private http = inject(HttpClient);
  private commService = inject(CommunicationService);

  private _loadingTeams = signal(false);
  private _loadingPlayers = signal(false);
  private _loadingPlayer = signal(false);
  public readonly loadingTeams = this._loadingTeams.asReadonly();
  public readonly loadingPlayers = this._loadingPlayers.asReadonly();
  public readonly loadingPlayer = this._loadingPlayer.asReadonly();

  private _apiEndpoint = environment.apiEndpoint;
  private _teamReqInProgress = false;

  // Cache
  private _currentTeam = signal<CSGOTeam>(null);
  private _currentTeamMembers = signal<TeamMember []>(null);
  private _currentTeamPractice = signal<Availability []>(null);
  private _currentPlayer = signal<ApplicationUser>(null);
  private readonly currentTeam = this._currentTeam.asReadonly();
  private readonly currentTeamMembers = this._currentTeamMembers.asReadonly();
  private readonly currentTeamPractice = this._currentTeamPractice.asReadonly();
  private readonly currentPlayer = this._currentPlayer.asReadonly();
  private _teamApplications = new Map<string, Observable<TeamApplication[]>>();

  public getUserTeams(userId: string) {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/users/userteams?userid=${userId}`, { withCredentials: true });
  }

  public teamApplications(teamId: string): Observable<TeamApplication []> {
    if (!this._teamApplications.has(teamId)) {
      this._teamApplications.set(teamId, this.getTeamApplications(teamId));
    }

    return this._teamApplications.get(teamId);
  }

  public getTeam(teamId: string): Signal<CSGOTeam> {
    untracked(() => {
      if (!this._teamReqInProgress) {
        const team = this._currentTeam();
        if (!team || team.teamId !== teamId || team.customUrl !== teamId) {
          this._teamReqInProgress = true;
          this.getTeamFromServer(teamId).subscribe(response => {
            this._currentTeam.set(response);
            this._teamReqInProgress = false;
          });
        }
      }
    });
    return this.currentTeam;
  }

  public getTeamMembers(teamId: string): Signal<TeamMember []> {
    untracked(() => {
      const team = this._currentTeam();
      if (!this._currentTeamMembers() || team.teamId !== teamId || team.customUrl !== teamId) {
        this.getTeamMembersFromServer(teamId).subscribe(members => {
          this._currentTeamMembers.set(members);
        });
      }
    });
    return this.currentTeamMembers;
  }

  public getTeamSchedule(teamId: string): Signal<Availability []> {
    untracked(() => {
      const team = this._currentTeam();
      if (!this._currentTeamPractice() || team.teamId !== teamId || team.customUrl !== teamId) {
        this.getTeamPractice(teamId).subscribe(schedule => {
          this._currentTeamPractice.set(schedule);
        });
      }
    });
    return this.currentTeamPractice;
  }

  public registerSteamGroup(group: SteamGroup) {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/team`, group, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`${group.groupName} registered successfully!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public registerTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/newteam`, team, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`${team.teamName} registered successfully!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public updateTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.put<CSGOTeam>(`${this._apiEndpoint}/teams/team`, team, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`${team.teamName} updated successfully!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public updateTeamMember(teamMember: TeamMember): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this._apiEndpoint}/teams/member`, teamMember, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`${teamMember.username} updated successfully!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  // TODO: Refactor to use only teamId and userId
  public removeTeamMember(teamMember: TeamMember) {
    return this.http.delete(`${this._apiEndpoint}/teams/removemember?teamId=${teamMember.teamId}&userId=${teamMember.userId}`,
      { withCredentials: true }).pipe(
        map(response => {
          this.commService.emitSuccess(`${teamMember.username} removed from team!`);
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
      );
  }

  public abandonTeam(team: CSGOTeam) {
    return this.http.delete(`${this._apiEndpoint}/teams/abandon?teamId=${team.teamId}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`You're are no longer part of ${team.teamName}`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  // TODO: Refactor to use only steamID64 and teamId
  public inviteToTeam(steamUser: SteamUser, team: CSGOTeam) {
    return this.http.post(`${this._apiEndpoint}/teams/invite`,
      { userId: steamUser.steamID64, teamId: team.teamId }, { withCredentials: true }).pipe(
        map(response => {
          this.commService.emitSuccess(`${steamUser.steamID} successfully invited to ${team.teamName}`);
          return response;
        }),
        catchError(error => {
          this.commService.emitError(error.message);
          return throwError(() => error);
        })
    );
  }

  public submitApplication(application: TeamApplication) {
    return this.http.post(`${this._apiEndpoint}/teams/apply`, application, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`Application submitted successfully!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public getTeamApplications(teamId: string): Observable<TeamApplication []> {
    return this.http.get<TeamApplication []>(`${this._apiEndpoint}/teams/applications?teamId=${teamId}`, { withCredentials: true });
  }

  public approveApplication(application: TeamApplication): Observable<TeamApplication> {
    return this.http.put<TeamApplication>(`${this._apiEndpoint}/teams/approveapplication`, application, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`${application.userName} is now part of your team!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public rejectApplication(application: TeamApplication): Observable<TeamApplication> {
    return this.http.put<TeamApplication>(`${this._apiEndpoint}/teams/rejectapplication`, application, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(`${application.userName} application has been rejected!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public setTeamMapPool(mapstatus: CSGOMapPool []): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/teams/mapPool`, mapstatus, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Map selection saved!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public getTeamTournaments(teamid: string) {
    return this.http.get<Tournament []>(`${this._apiEndpoint}/teams/tournaments?teamid=${teamid}`);
  }

  public getTeamPractice(teamid: string) {
    return this.http.get<Availability []>(`${this._apiEndpoint}/teams/availability?teamid=${teamid}`);
  }

  public setTeamPractice(day: Availability) {
    return this.http.put(`${this._apiEndpoint}/teams/availability`, day, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Practice schedule updated!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public getPlayer(userId: string): Signal<ApplicationUser> {
    untracked(() => {
      if (!this.playerMatch(userId)) {
        this._currentPlayer.set(null);
        this._loadingPlayer.set(true);
        this.getPlayerFromServer(userId).subscribe({
          next: player => {
            this._currentPlayer.set(player);
            this._loadingPlayer.set(false);
          },
          error: () => {
            this._currentPlayer.set(null);
            this._loadingPlayer.set(false);
          }
        });
      }
    });
    return this.currentPlayer;
  }

  public getPlayerTournaments(userid: string) {
    return this.http.get<Tournament []>(`${this._apiEndpoint}/users/tournaments?userid=${userid}`);
  }

  public getPlayerGroups(userId: string) {
    return this.http.get<SteamGroup []>(`${this._apiEndpoint}/users/usergroups?userid=${userId}`);
  }

  public getPlayerFromServer(userId: string) {
    return this.http.get<ApplicationUser>(`${this._apiEndpoint}/users?userid=${userId}`).pipe(
      map(response => {
        if (response.userStatsException) {
          this.commService.emitError('Account is private!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public getAvailability(userid: string): Observable<Availability []> {
    return this.http.get<Availability []>(`${this._apiEndpoint}/users/availability?userid=${userid}`);
  }

  public setAvailability(availability: Availability): Observable<Availability> {
    return this.http.put<Availability>(`${this._apiEndpoint}/users/availability`, availability, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Availability updated!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public setPrimaryRole(role: Role, userId: string): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/primaryrole?id=${role.id}`, role, { withCredentials: true }).pipe(
      map(response => {
        this.updateCurrentPlayerDetails(userId, { primaryRole: role.id });
        this.commService.emitSuccess(`Primary role set to ${role.name}`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public setSecondaryRole(role: Role, userId: string): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/secondaryrole?id=${role.id}`, role, { withCredentials: true }).pipe(
      map(response => {
        this.updateCurrentPlayerDetails(userId, { secondaryRole: role.id });
        this.commService.emitSuccess(`Secondary role set to ${role.name}`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public getMapPool(userid: string): Observable<CSGOMapPool []> {
    return this.http.get<CSGOMapPool []>(`${this._apiEndpoint}/users/mapPool?userid=${userid}`);
  }

  public setMapPool(mapstatus: CSGOMapPool): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/mapPool`, mapstatus, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Map pool updated!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public acceptInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/acceptTeamInvite`, notification, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Team invite accepted!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public rejectInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/rejectTeamInvite`, notification, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Team invite rejected!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public getSignupCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this._apiEndpoint}/account/earlybirdcount`, { withCredentials: true }).pipe(
      map(r => r?.count ?? 0),
      catchError(() => throwError(() => new Error('Failed to get signup count')))
    );
  }

  public earlyBirdSignup(payload: EarlyBird) {
    return this.http.post<{ message: string }>(`${this._apiEndpoint}/account/earlybirdsignup`, payload, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess(response.message);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message || `An error occurred while submitting your pre-registration. Please try again later.`);
        return throwError(() => error)
      })
    );
  }

  private getTeamFromServer(teamId: string) {
    return this.http.get<CSGOTeam>(`${this._apiEndpoint}/teams?teamid=${teamId}`);
  }

  private getTeamMembersFromServer(teamId: string) {
    return this.http.get<TeamMember []>(`${this._apiEndpoint}/teams/members?teamid=${teamId}`);
  }

  private updateCurrentPlayerDetails(userId: string, details: Partial<CSGODetails>) {
    const player = this._currentPlayer();
    // The PUT can resolve after navigation has swapped the cached player, so only
    // patch the cache if it still holds the player that was actually edited.
    if (player?.id === userId && player.csgoDetails) {
      this._currentPlayer.set({ ...player, csgoDetails: { ...player.csgoDetails, ...details } });
    }
  }

  private playerMatch(userId: string) {
    const player = this._currentPlayer();
    return player && player.steamUser &&
      (player.steamUser.customURL === userId || player.steamUser.steamID64 === userId);
  }
}
