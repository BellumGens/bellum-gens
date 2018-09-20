import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup } from '../models/steamuser';
import { Observable, ReplaySubject } from 'rxjs';
import { CSGOTeam, TeamMember } from '../models/csgoteam';
import { CSGOPlayer } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { MapPool } from 'src/app/models/csgomaps';

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api';
  private _usersDataSubject = new ReplaySubject<CSGOPlayer []>(1);
  private _teamsDataSubject = new ReplaySubject<CSGOTeam []>(1);

  public activeUsers: Observable<CSGOPlayer []> = this._usersDataSubject.asObservable();
  public csgoTeams: Observable<CSGOTeam []> = this._teamsDataSubject.asObservable();
  public error: any = null;

  constructor(private http: HttpClient) { }

  public getActiveUsers(): void {
    this.http.get<CSGOPlayer []>(this._apiEndpoint + '/users/activeusers').subscribe(
      data => this._usersDataSubject.next(data),
      error => this.error = error
    );
  }

  public getTeam(teamId: string): Observable<CSGOTeam> {
    return this.http.get<CSGOTeam>(this._apiEndpoint + '/teams/team?teamid=' + teamId);
  }

  public getTeams(): void {
    this.http.get<CSGOTeam []>(this._apiEndpoint + '/teams/teams').subscribe(
      data => this._teamsDataSubject.next(data),
      error => this.error = error
    );
  }

  public registerSteamGroup(group: SteamGroup): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(this._apiEndpoint + '/teams/team', group, { withCredentials: true });
  }

  public registerTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(this._apiEndpoint + '/teams/newteam', team, { withCredentials: true });
  }

  public updateTeamMember(teamMember: TeamMember): Observable<any> {
    return this.http.put(this._apiEndpoint + '/teams/member', teamMember, { withCredentials: true });
  }

  public removeTeamMember(teamMember: TeamMember): Observable<any> {
    return this.http.delete(this._apiEndpoint +
              `/teams/removemember?teamId=${teamMember.TeamId}&userId=${teamMember.UserId}`,
              { withCredentials: true });
  }

  public getUser(userid: string): Observable<CSGOPlayer> {
    return this.http.get<CSGOPlayer>(this._apiEndpoint + '/users/user?userid=' + userid);
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
