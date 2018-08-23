import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamUserWithStats, Availability, PlaystyleRole } from '../models/steamuser';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api/users';
  private _rootApiEndpoint = 'http://localhost:25702';
  private _dataSubject = new ReplaySubject<SteamUserWithStats []>(1);

  public activeUsers: Observable<SteamUserWithStats []> = this._dataSubject.asObservable();
  public error: any = null;

  constructor(private http: HttpClient) { }

  public getActiveUsers(): void {
    this.http.get<SteamUserWithStats []>(this._apiEndpoint + '/activeusers').subscribe(
      data => this._dataSubject.next(data),
      error => this.error = error
    );
  }

  public getUser(userid: string): Observable<SteamUserWithStats> {
    return this.http.get<SteamUserWithStats>(this._apiEndpoint + '/user?userid=' + userid);
  }

  public setAvailability(availability: Availability): Observable<any> {
    return this.http.put(this._apiEndpoint + '/availability', availability, { withCredentials: true });
  }

  public setPrimaryRole(role: PlaystyleRole) {
    return this.http.put(this._apiEndpoint + '/primaryrole', role, { withCredentials: true });
  }

  public setSecondaryRole(role: PlaystyleRole) {
    return this.http.put(this._apiEndpoint + '/secondaryrole', role, { withCredentials: true });
  }
}
