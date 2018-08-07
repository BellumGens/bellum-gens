import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { LoginProvider } from '../models/login-provider';
import { SteamUser } from '../models/steamuser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _apiEndpoint = 'http://localhost:25702/api/account';
  private _rootApiEndpoint = 'http://localhost:25702';
  private _dataSubject = new ReplaySubject<SteamUser>(1);

  public steamUser: Observable<SteamUser> = this._dataSubject.asObservable();
  public callMade = false;

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
    this.http.post(this._apiEndpoint + '/logout', null, {withCredentials: true}).subscribe(data => this._dataSubject.next(null));
  }

  public getSteamUser(): void {
    this.http.get<SteamUser>(this._apiEndpoint + '/userinfo', {withCredentials: true}).subscribe(data => {
      this._dataSubject.next(data);
      this.callMade = true;
    });
  }

  public loginProviders(): Observable<LoginProvider []> {
    return this.http.get<LoginProvider []>(this._apiEndpoint + '/ExternalLogins?returnUrl=%2F&generateState=true');
  }
}
