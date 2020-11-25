import { Injectable, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { Promo } from '../models/jerseyorder';
import { ApplicationUser, UserPreferences, AdminAppUserSummary } from '../models/applicationuser';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { SwPush } from '@angular/service-worker';
import { NotificationActions, PushNotificationWrapper } from '../models/usernotifications';
import { Router } from '@angular/router';
import { CommunicationService } from './communication.service';
import { UserRegistration, UserLogin } from '../models/userlogin';
import { TournamentApplication } from '../models/tournament';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _apiEndpoint = environment.authApiEndpoint;
  private _apiBase = environment.apiEndpoint;
  private _rootApiEndpoint = environment.rootApiEndpoint;

  private _isBrowser: boolean;

  private _applicationUser = new BehaviorSubject<ApplicationUser>(null);
  private _registrations = new BehaviorSubject<TournamentApplication []>(null);
  public userCheckInProgress = new BehaviorSubject<boolean>(false);
  public error: any;
  public callMade = false;

  public openLogin = new EventEmitter<string>();

  constructor(@Inject(PLATFORM_ID) platformId: Object,
              private http: HttpClient,
              private swPush: SwPush,
              private router: Router,
              private commService: CommunicationService) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  public emitOpenLogin(title?: string) {
    this.openLogin.emit(title);
  }

  public addPushSubscriber(sub: PushSubscription) {
    return this.http.post(`${this._apiBase}/push/subscribe`, sub, { withCredentials: true });
  }

  public get loginProviders() {
    return this.http.get<LoginProvider []>(`${this._apiEndpoint}/ExternalLogins?returnUrl=%2F`);
  }

  public get addLoginProviders() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<LoginProvider []>(`${this._apiEndpoint}/ExternalLogins?returnUrl=%2F&routeName=AddExternalLogin`);
  }

  public get tournamentRegistrations() {
    if (!this._registrations.value) {
      this.getRegistrations();
    }
    return this._registrations;
  }

  public getRegistrations() {
    this.http.get<TournamentApplication []>(`${this._apiBase}/tournament/registrations`, { withCredentials: true}).subscribe(data => {
      this._registrations.next(data);
    });
  }

  public get applicationUser() {
    if (!this._applicationUser.value && !this.userCheckInProgress.value) {
      if (this._isBrowser) {
        this.userCheckInProgress.next(true);
        this.getSteamUser().subscribe(
          user => {
            if (user) {
              this._applicationUser.next(user);
              this.initSw();
            }
            this.userCheckInProgress.next(false);
          },
          _ => this.userCheckInProgress.next(false)
        );
      }
    }

    return this._applicationUser;
  }

  public getUserIsAppAdmin() {
    return this.http.get<boolean>(`${this._apiBase}/admin/appadmin`, { withCredentials: true });
  }

  public getUserIsTournamentAdmin() {
    return this.http.get<boolean>(`${this._apiBase}/admin/tournamentadmin`, { withCredentials: true });
  }

  public getUserIsTeamAdmin(teamid: string) {
    return this.http.get<boolean>(`${this._apiBase}/teams/teamadmin?teamid=${teamid}`, { withCredentials: true });
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
        if (response) {
          this.commService.emitSuccess('Logged in successfully!');
          this._applicationUser.next(response);
          this.getRegistrations();
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error.Message);
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
        this.commService.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public updateUserPreferences(preferences: UserPreferences) {
    return this.http.put<UserPreferences>(`${this._apiEndpoint}/userinfo`, preferences, { withCredentials: true}).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Preferences updated successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error.Message);
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
        this.commService.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public deleteAccount(userid: string) {
    return this.http.delete(`${this._apiEndpoint}/delete?userid=${userid}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this._applicationUser.next(null);
          this.commService.emitSuccess(`Account deleted!`);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public checkUsername(username: string) {
    return this.http.get<boolean>(`${this._apiEndpoint}/username?username=${username}`);
  }

  private initSw() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      this.addPushSubscriber(sub).subscribe();
      this.swPush.messages.subscribe(message => {
        this.commService.emitMessage((<PushNotificationWrapper>message).notification.title);

        // Update the app user with new notifications and teams
        this.getSteamUser().subscribe(user => this._applicationUser.next(user));
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

  private getSteamUser() {
    return this.http.get<ApplicationUser>(`${this._apiEndpoint}/userinfo`, { withCredentials: true });
  }
}
