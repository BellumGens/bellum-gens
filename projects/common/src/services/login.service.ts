import { Injectable, Signal, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { Promo } from '../models/order';
import { ApplicationUser, UserPreferences } from '../models/applicationuser';
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
  private http = inject(HttpClient);
  private swPush = inject(SwPush);
  private router = inject(Router);
  private commService = inject(CommunicationService);

  private _userCheckInProgress = signal(false);
  public readonly userCheckInProgress = this._userCheckInProgress.asReadonly();

  private _openLogin = new Subject<void>();
  public readonly openLogin = this._openLogin.asObservable();

  private _apiEndpoint = environment.authApiEndpoint;
  private _apiBase = environment.apiEndpoint;
  private _applicationUser = signal<ApplicationUser>(null);
  private _applicationUserReadonly = this._applicationUser.asReadonly();
  private _userNotifications = signal<UserNotification []>(null);
  private _userNotificationsReadonly = this._userNotifications.asReadonly();
  private _registrations = signal<TournamentApplication []>(null);
  private _registrationsReadonly = this._registrations.asReadonly();
  private _teamsAdmin = signal<CSGOTeam []>(null);
  private _teamsAdminReadonly = this._teamsAdmin.asReadonly();

  public emitOpenLogin() {
    this._openLogin.next();
  }

  public addPushSubscriber(sub: PushSubscription) {
    return this.http.post(`${this._apiBase}/push/subscribe`, sub, { withCredentials: true });
  }

  public get loginProviders() {
    return this.http.get<LoginProvider []>(`${this._apiEndpoint}/ExternalLogins?returnUrl=%2F`);
  }

  /** Lazily loads the current user's tournament registrations on first access. */
  public get tournamentRegistrations(): Signal<TournamentApplication []> {
    untracked(() => {
      if (!this._registrations()) {
        this.getRegistrations();
      }
    });
    return this._registrationsReadonly;
  }

  /** Replaces the cached tournament registrations (e.g. after a registration was deleted). */
  public setTournamentRegistrations(registrations: TournamentApplication []) {
    this._registrations.set(registrations);
  }

  /** Lazily loads the teams the current user administers on first access. */
  public get teamsAdmin(): Signal<CSGOTeam []> {
    untracked(() => {
      if (!this._teamsAdmin()) {
        this.getUserTeamsAdmin().subscribe(teams => this._teamsAdmin.set(teams));
      }
    });
    return this._teamsAdminReadonly;
  }

  public getRegistration(tournamentId: string) {
    return this.http.get<TournamentApplication>(`${this._apiBase}/tournament/userregistration?tournamentId=${tournamentId}`, { withCredentials: true});
  }

  public getRegistrations() {
    this.http.get<TournamentApplication []>(`${this._apiBase}/tournament/registrations`, { withCredentials: true}).subscribe(data => {
      this._registrations.set(data);
    });
  }

  /** Lazily checks for a logged in user on first access. `null` means no (known) user. */
  public get applicationUser(): Signal<ApplicationUser> {
    untracked(() => {
      if (!this._applicationUser() && !this._userCheckInProgress()) {
        this._userCheckInProgress.set(true);
        this.getAppUser().subscribe({
          next: (user) => {
            if (user) {
              this._applicationUser.set(user);
              this.initSw();
            }
            this._userCheckInProgress.set(false);
          },
          error: () => this._userCheckInProgress.set(false)
        });
      }
    });

    return this._applicationUserReadonly;
  }

  /** Lazily loads the current user's notifications on first access. */
  public get userNotifications(): Signal<UserNotification []> {
    untracked(() => {
      if (!this._userNotifications()) {
        this.getUserNotifications().subscribe(data => this._userNotifications.set(data));
      }
    });

    return this._userNotificationsReadonly;
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

  // public getUsers() {
  //   return this.http.get<AdminAppUserSummary []>(`${this._apiBase}/admin/users`, { withCredentials: true });
  // }

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
        this._applicationUser.set(response);
        this.getRegistrations();
        return response;
      }),
      catchError(error => {
        const errorMessage = typeof error.error === 'string' && error.error
          ? error.error
          : 'Login failed. Please check your credentials and try again.';
        this.commService.emitError(errorMessage);
        return throwError(() => error);
      })
    );
  }

  public logout() {
    return this.http.post(`${this._apiEndpoint}/logout`, null, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Logged out successfully!');
        this._applicationUser.set(null);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
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
        this.commService.emitError(error.message);
        return throwError(() => error);
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
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public deleteAccount(userid: string) {
    return this.http.delete(`${this._apiEndpoint}/delete?userid=${userid}`, { withCredentials: true }).pipe(
      map(response => {
        this._applicationUser.set(null);
        this.commService.emitSuccess(`Account deleted!`);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public checkUsername(username: string) {
    return this.http.get<boolean>(`${this._apiEndpoint}/username?username=${username}`);
  }

  public addSubscriber(email: string) {
    return this.http.post(`${this._apiEndpoint}/account/subscribe`, { email }).pipe(
      map(response => {
        this.commService.emitSuccess('Subscribed successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
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
          this.getAppUser().subscribe(user => this._applicationUser.set(user));
        });
        this.swPush.notificationClicks.subscribe(action => {
          if (action.action === NotificationActions.ViewTeam) {
            this.router.navigate(['team', action.notification.data]);
          } else if (action.action === NotificationActions.ViewUser) {
            this.router.navigate(['players', action.notification.data]);
          } else if (action.action === NotificationActions.ViewStrategy) {
            this.router.navigate(['strategies', 'details', action.notification.data]);
          } else if (action.action === NotificationActions.Checkin) {
            window.open(action.notification.data.callbackUrl, '_blank');
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
