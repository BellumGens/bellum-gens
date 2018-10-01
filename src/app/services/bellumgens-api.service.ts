import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup } from '../models/steamuser';
import { Observable } from 'rxjs';
import { CSGOTeam, TeamMember } from '../models/csgoteam';
import { CSGOPlayer } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { MapPool } from 'src/app/models/csgomaps';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api';

  private _activeUsers: Observable<CSGOPlayer []>;
  private _csgoTeams: Observable<CSGOTeam []>;
  public error: any = null;

  constructor(private http: HttpClient) { }

  public get activeUsers() {
    if (!this._activeUsers) {
      this._activeUsers = this.getActiveUsers().pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this._activeUsers;
  }

  public get csgoTeams() {
    if (!this._csgoTeams) {
      this._csgoTeams = this.getTeams().pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this._csgoTeams;
  }

  private getActiveUsers() {
    return this.http.get<CSGOPlayer []>(this._apiEndpoint + '/users/activeusers').pipe(
      map(response => response)
    );
  }

  private getTeams() {
    return this.http.get<CSGOTeam []>(this._apiEndpoint + '/teams/teams').pipe(
      map(response => response)
    );
  }

  public getTeam(teamId: string): Observable<CSGOTeam> {
    return this.http.get<CSGOTeam>(this._apiEndpoint + '/teams/team?teamid=' + teamId);
  }

  public registerSteamGroup(group: SteamGroup): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(this._apiEndpoint + '/teams/team', group, { withCredentials: true });
  }

  public registerTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(this._apiEndpoint + '/teams/newteam', team, { withCredentials: true });
  }

  public updateTeamMember(teamMember: TeamMember) {
    return this.http.put(this._apiEndpoint + '/teams/member', teamMember, { withCredentials: true });
  }

  public removeTeamMember(teamMember: TeamMember) {
    return this.http.delete(this._apiEndpoint +
              `/teams/removemember?teamId=${teamMember.TeamId}&userId=${teamMember.UserId}`,
              { withCredentials: true });
  }

  public abandonTeam(teamId: string) {
    return this.http.delete(this._apiEndpoint + `/teams/abandon?teamId=${teamId}`,
              { withCredentials: true });
  }

  public inviteToTeam(userId: string, team: CSGOTeam) {
    return this.http.post(this._apiEndpoint + `/teams/invite?userId=${userId}`, team, { withCredentials: true });
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

  public setMapPool(mapstatus: MapPool): Observable<any> {
    return this.http.put(this._apiEndpoint + '/users/mapPool', mapstatus, { withCredentials: true });
  }
}
