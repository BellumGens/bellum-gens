import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { ApplicationUser } from '../models/applicationuser';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SwPush } from '@angular/service-worker';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _apiEndpoint = environment.authApiEndpoint;
  private _rootApiEndpoint = environment.rootApiEndpoint;

  private _applicationUser: ReplaySubject<ApplicationUser>;
  private _loginProviders: Observable<LoginProvider []>;
  public error: any;
  public callMade = false;

  constructor(private http: HttpClient,
              private swPush: SwPush) { }

  public addPushSubscriber(sub: PushSubscription, user: ApplicationUser) {
    const userSub = {
      sub: sub,
      userId: user.SteamUser.steamID64
    };
    return this.http.post(`${this._apiEndpoint}/push/subscribe`, userSub);
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
          this._applicationUser.next(user);

          this.swPush.requestSubscription({
            serverPublicKey: environment.VAPID_PUBLIC_KEY
          })
          .then(sub => this.addPushSubscriber(sub, user).subscribe())
          .catch(error => console.log(error));
        },
        error => this._applicationUser = null
      );
    }

    return this._applicationUser.asObservable();
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
    this.http.post(this._apiEndpoint + '/logout', null, { withCredentials: true }).subscribe(
      _ => this._applicationUser.next(null)
    );
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
