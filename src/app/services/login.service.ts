import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { ApplicationUser, UserPreferences } from '../models/applicationuser';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SwPush } from '@angular/service-worker';
import { NotificationActions, PushNotificationWrapper } from '../models/usernotifications';
import { Router } from '@angular/router';
import { CommunicationService } from './communication.service';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _apiEndpoint = environment.authApiEndpoint;
  private _apiBase = environment.apiEndpoint;
  private _rootApiEndpoint = environment.rootApiEndpoint;

  private _applicationUser: ReplaySubject<ApplicationUser>;
  private _loginProviders: Observable<LoginProvider []>;
  public error: any;
  public callMade = false;

  constructor(private http: HttpClient,
              private swPush: SwPush,
              private router: Router,
              private commService: CommunicationService) { }

  public addPushSubscriber(sub: PushSubscription) {
    return this.http.post(`${this._apiBase}/push/subscribe`, sub, { withCredentials: true });
  }

  public get loginProviders() {
    if (!this._loginProviders) {
      this._loginProviders = this.getLoginProviders().pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this._loginProviders;
  }

  public get applicationUser() {
    if (!this._applicationUser) {
      this._applicationUser = new ReplaySubject<ApplicationUser>(1);
      this.getSteamUser().subscribe(
        user => {
          if (user) {
            this._applicationUser.next(user);
          }
          this.initSw();
        }
      );
    }

    return this._applicationUser;
  }

  public login(provider: string) {
    this.loginProviders.subscribe((data: LoginProvider []) =>
      data.forEach((item: LoginProvider) => {
        if (item.Name === provider) {
          window.location.href = this._rootApiEndpoint + item.Url;
        }
      })
    );
  }

  public logout() {
    this.http.post(`${this._apiEndpoint}/logout`, null, { withCredentials: true }).subscribe(
      _ => this._applicationUser.next(null)
    );
  }

  public updateUserPreferences(preferences: UserPreferences) {
    return this.http.put<UserPreferences>(`${this._apiEndpoint}/userinfo`, preferences, { withCredentials: true}).pipe(
      map(response => {
        if (response) {
          let message = 'Preferences updated successfully!';
          if (response.newEmail) {
            message += ` A confirmation link as been sent to ${response.email}.`;
          }
          this.commService.emitSuccess(message);
        }
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
    return this.http.get<ApplicationUser>(this._apiEndpoint + '/userinfo', { withCredentials: true });
  }

  private getLoginProviders() {
    return this.http.get<LoginProvider []>(this._apiEndpoint + '/ExternalLogins?returnUrl=%2F&generateState=true').pipe(
      map(response => response)
    );
  }
}
