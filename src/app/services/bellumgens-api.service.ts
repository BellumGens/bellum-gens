import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamUserWithStats, Availability, Role, MapPool } from '../models/steamuser';
import { Observable, ReplaySubject } from 'rxjs';
import { CSGOTeam } from '../models/csgoteam';

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api';
  private _usersDataSubject = new ReplaySubject<SteamUserWithStats []>(1);
  private _teamsDataSubject = new ReplaySubject<CSGOTeam []>(1);

  public activeUsers: Observable<SteamUserWithStats []> = this._usersDataSubject.asObservable();
  public csgoTeams: Observable<CSGOTeam []> = this._teamsDataSubject.asObservable();
  public error: any = null;

  constructor(private http: HttpClient) { }

  public getActiveUsers(): void {
    this.http.get<SteamUserWithStats []>(this._apiEndpoint + '/users/activeusers').subscribe(
      data => this._usersDataSubject.next(data),
      error => this.error = error
    );
  }

  public getTeam(): void {

  }

  public getTeams(): void {
    this.http.get<CSGOTeam []>(this._apiEndpoint + '/teams/teams').subscribe(
      data => this._teamsDataSubject.next(data),
      error => this.error = error
    );
  }

  public getUser(userid: string): Observable<SteamUserWithStats> {
    return this.http.get<SteamUserWithStats>(this._apiEndpoint + '/users/user?userid=' + userid);
  }

  public setAvailability(availability: Availability): Observable<any> {
    return this.http.put(this._apiEndpoint + '/users/availability', availability, { withCredentials: true });
  }

  public setPrimaryRole(role: Role): Observable<any> {
    return this.http.put(this._apiEndpoint + '/users/primaryrole', role, { withCredentials: true });
  }

  public setSecondaryRole(role: Role): Observable<any> {
    return this.http.put(this._apiEndpoint + '/users/secondaryrole', role, { withCredentials: true });
  }

  public setMapPool(map: MapPool): Observable<any> {
    return this.http.put(this._apiEndpoint + '/users/mapPool', map, { withCredentials: true });
  }
}
