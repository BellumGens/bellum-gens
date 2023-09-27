import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { Promo } from '../models/jerseyorder';
import { ApplicationUser, UserPreferences, AdminAppUserSummary } from '../models/applicationuser';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { SwPush } from '@angular/service-worker';
import { NotificationActions, PushNotificationWrapper, UserNotification } from '../models/usernotifications';
import { Router } from '@angular/router';
import { CommunicationService } from './communication.service';
import { UserRegistration, UserLogin } from '../models/userlogin';
import { TournamentApplication } from '../models/tournament';
import { CSGOTeam } from '../models/csgoteam';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public userCheckInProgress = new BehaviorSubject<boolean>(false);
  public openLogin = new EventEmitter<string>();

  private _apiEndpoint = environment.authApiEndpoint;
  private _apiBase = environment.apiEndpoint;
  private _applicationUser = new BehaviorSubject<ApplicationUser>(null);
  private _userNotifications = new BehaviorSubject<UserNotification []>(null);
  private _registrations = new BehaviorSubject<TournamentApplication []>(null);
  private _teamsAdmin = new BehaviorSubject<CSGOTeam []>(null);

  constructor(private http: HttpClient,
              private swPush: SwPush,
              private router: Router,
              private commService: CommunicationService) {
  }

  public emitOpenLogin() {
    this.openLogin.emit();
  }

  public addPushSubscriber(sub: PushSubscription) {
    return this.http.post(`${this._apiBase}/push/subscribe`, sub, { withCredentials: true });
  }

  public get loginProviders() {
    return this.http.get<LoginProvider []>(`${this._apiEndpoint}/ExternalLogins?returnUrl=%2F`);
  }

  public get tournamentRegistrations() {
    if (!this._registrations.value) {
      this.getRegistrations();
    }
    return this._registrations;
  }

  public get teamsAdmin() {
    if (!this._teamsAdmin.value) {
      this.getUserTeamsAdmin().subscribe(teams => this._teamsAdmin.next(teams));
    }
    return this._teamsAdmin;
  }

  public getRegistrations() {
    this.http.get<TournamentApplication []>(`${this._apiBase}/tournament/registrations`, { withCredentials: true}).subscribe(data => {
      this._registrations.next(data);
    });
  }

  public get applicationUser() {
    if (!this._applicationUser.value && !this.userCheckInProgress.value) {
      this.userCheckInProgress.next(true);
      this.getAppUser().subscribe(
        user => {
          if (user) {
            this._applicationUser.next(user);
            this.initSw();
          }
          this.userCheckInProgress.next(false);
        },
        () => this.userCheckInProgress.next(false)
      );
    }

    return this._applicationUser;
  }

  public get userNotifications() {
    if (!this._userNotifications.value) {
      this.getUserNotifications().subscribe(data => this._userNotifications.next(data));
    }

    return this._userNotifications;
  }

  public getUserIsAppAdmin() {
    return this.http.get<boolean>(`${this._apiBase}/admin`, { withCredentials: true });
  }

  public getUserIsTournamentAdmin() {
    return this.http.get<boolean>(`${this._apiBase}/admin/tournamentadmin`, { withCredentials: true });
  }

  public getUserIsTeamAdmin(teamid: string) {
    return this.http.get<boolean>(`${this._apiBase}/teams/teamadmin?teamid=${teamid}`, { withCredentials: true });
  }

  public getUserIsTeamMember(teamid: string) {
    return this.http.get<boolean>(`${this._apiBase}/teams/teammember?teamid=${teamid}`, { withCredentials: true });
  }

  public getUserIsTeamEditor(teamid: string) {
    return this.http.get<boolean>(`${this._apiBase}/teams/teameditor?teamid=${teamid}`, { withCredentials: true });
  }

  public getUsers() {
    return this.http.get<AdminAppUserSummary []>(`${this._apiBase}/admin/users`, { withCredentials: true });
  }

  public getUserRoles() {
    return this.http.get<string []>(`${this._apiBase}/admin/roles`, { withCredentials: true });
  }

  public getPromoCodes() {
    return this.http.get<Promo []>(`${this._apiBase}/admin/promos`, { withCredentials: true });
  }

  public submitRole(role: string) {
    return this.http.put<string>(`${this._apiBase}/admin/createrole?rolename=${role}`, role, { withCredentials: true });
  }

  public addUserToRole(userId: string, role: string) {
    return this.http.put<string>(`${this._apiBase}/admin/adduserrole?userid=${userId}&role=${role}`, role, { withCredentials: true });
  }

  public login(provider: LoginProvider) {
    window.location.href = `${provider.url}&returnUrl=${window.location.href}`;
  }

  public loginWithForm(logininfo: UserLogin) {
    return this.http.post<ApplicationUser>(`${this._apiEndpoint}/login`, logininfo, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Logged in successfully!');
        this._applicationUser.next(response);
        this.getRegistrations();
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public logout() {
    return this.http.post(`${this._apiEndpoint}/logout`, null, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Logged out successfully!');
        this._applicationUser.next(null);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public updateUserPreferences(preferences: UserPreferences) {
    return this.http.put<UserPreferences>(`${this._apiEndpoint}/userinfo`, preferences, { withCredentials: true}).pipe(
      map(response => {
        this.commService.emitSuccess('Preferences updated successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public submitRegistration(userAccount: UserRegistration) {
    return this.http.post<UserRegistration>(`${this._apiEndpoint}/setpassword`, userAccount, { withCredentials: true}).pipe(
      map(response => {
        this.commService.emitSuccess('User registration completed successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error[''].join(' '));
        return throwError(error);
      })
    );
  }

  public deleteAccount(userid: string) {
    return this.http.delete(`${this._apiEndpoint}/delete?userid=${userid}`, { withCredentials: true }).pipe(
      map(response => {
        this._applicationUser.next(null);
        this.commService.emitSuccess(`Account deleted!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public checkUsername(username: string) {
    return this.http.get<boolean>(`${this._apiEndpoint}/username?username=${username}`);
  }

  public addSubscriber(email: string) {
    return this.http.post(`${this._apiEndpoint}/account/subscribe`, { email }).pipe(
      map(response => {
        this.commService.emitSuccess(response.toString());
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  private initSw() {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        this.addPushSubscriber(sub).subscribe();
        this.swPush.messages.subscribe((message: PushNotificationWrapper) => {
          this.commService.emitMessage(message.notification.title);

          // Update the app user with new notifications and teams
          this.getAppUser().subscribe(user => this._applicationUser.next(user));
        });
        this.swPush.notificationClicks.subscribe(action => {
          if (action.action === NotificationActions.ViewTeam) {
            this.router.navigate(['team', action.notification.data]);
          } else if (action.action === NotificationActions.ViewUser) {
            this.router.navigate(['players', action.notification.data]);
          } else if (action.action === NotificationActions.ViewStrategy) {
            this.router.navigate(['strategies', 'details', action.notification.data]);
          }
        });
      })
      .catch(error => console.log(error));
    }
  }

  private getAppUser() {
    return this.http.get<ApplicationUser>(`${this._apiEndpoint}`, { withCredentials: true });
  }

  private getUserNotifications() {
    return this.http.get<UserNotification []>(`${this._apiEndpoint}/usernotifications`, { withCredentials: true });
  }

  private getUserTeamsAdmin() {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/userteamsadmin`, { withCredentials: true });
  }
}
