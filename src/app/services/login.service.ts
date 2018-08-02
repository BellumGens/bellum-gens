import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { SteamUser } from '../models/steamuser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _apiEndpoint = 'http://localhost:25702/api/account';
  private _rootApiEndpoint = 'http://localhost:25702';

  constructor(private http: HttpClient) { }

  public login(provider: string) {
    this.loginProviders().subscribe((data: LoginProvider []) =>
      data.forEach((item: LoginProvider) => {
        if (item.Name === provider) {
          window.location.href = this._rootApiEndpoint + item.Url;
        }
      })
    );
  }

  public logout() {
    return this.http.post(this._apiEndpoint + '/logout', null, {withCredentials: true});
  }

  public steamUser(): Observable<SteamUser> {
    return this.http.get<SteamUser>(this._apiEndpoint + '/userinfo', {withCredentials: true});
  }

  public loginProviders(): Observable<LoginProvider []> {
    return this.http.get<LoginProvider []>(this._apiEndpoint + '/ExternalLogins?returnUrl=%2F&generateState=true');
  }
}
