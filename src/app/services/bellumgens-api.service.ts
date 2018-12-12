import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamGroup } from '../models/steamuser';
import { Observable } from 'rxjs';
import { CSGOTeam, TeamMember, TeamApplication } from '../models/csgoteam';
import { CSGOPlayer } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { Role } from '../models/playerrole';
import { MapPool } from 'src/app/models/csgomaps';
import { map, shareReplay } from 'rxjs/operators';
import { UserNotification } from '../models/usernotifications';
import { TeamStrategy } from '../models/csgoteamstrategy';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api';

  private _activeUsers: Observable<CSGOPlayer []>;
  private _csgoTeams: Observable<CSGOTeam []>;
  private _teamApplications = new Map<string, Observable<TeamApplication[]>>();
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

  public teamApplications(teamId: string): Observable<TeamApplication []> {
    if (!this._teamApplications[teamId]) {
      this._teamApplications[teamId] = this.getTeamApplications(teamId).pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this._teamApplications[teamId];
  }

  public getTeamStrats(teamId: string) {
    return this.http.get<TeamStrategy []>(`${this._apiEndpoint}/teams/strats?teamid=${teamId}`, { withCredentials: true });
  }

  private getActiveUsers() {
    return this.http.get<CSGOPlayer []>(`${this._apiEndpoint}/users/activeusers`).pipe(
      map(response => response)
    );
  }

  private getTeams() {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/teams/teams`).pipe(
      map(response => response)
    );
  }

  public getTeam(teamId: string): Observable<CSGOTeam> {
    return this.http.get<CSGOTeam>(`${this._apiEndpoint}/teams/team?teamid=${teamId}`);
  }

  public registerSteamGroup(group: SteamGroup): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/team`, group, { withCredentials: true });
  }

  public registerTeam(team: CSGOTeam): Observable<CSGOTeam> {
    return this.http.post<CSGOTeam>(`${this._apiEndpoint}/teams/newteam`, team, { withCredentials: true });
  }

  public updateTeamMember(teamMember: TeamMember) {
    return this.http.put(`${this._apiEndpoint}/teams/member`, teamMember, { withCredentials: true });
  }

  public removeTeamMember(teamMember: TeamMember) {
    return this.http.delete(`${this._apiEndpoint}/teams/removemember?teamId=${teamMember.TeamId}&userId=${teamMember.UserId}`,
              { withCredentials: true });
  }

  public abandonTeam(teamId: string) {
    return this.http.delete(`${this._apiEndpoint}/teams/abandon?teamId=${teamId}`, { withCredentials: true });
  }

  public inviteToTeam(userId: string, team: CSGOTeam) {
    return this.http.post(`${this._apiEndpoint}/teams/invite?userId=${userId}`, team, { withCredentials: true });
  }

  public submitApplication(application: TeamApplication) {
    return this.http.post(`${this._apiEndpoint}/teams/apply`, application, { withCredentials: true });
  }

  public getTeamApplications(teamId: string): Observable<TeamApplication []> {
    return this.http.get<TeamApplication []>(`${this._apiEndpoint}/teams/applications?teamId=${teamId}`, { withCredentials: true });
  }

  public approveApplication(application: TeamApplication) {
    return this.http.put(`${this._apiEndpoint}/teams/approveapplication`, application, { withCredentials: true });
  }

  public rejectApplication(application: TeamApplication) {
    return this.http.put(`${this._apiEndpoint}/teams/rejectapplication`, application, { withCredentials: true });
  }

  public getTeamMapPool(teamId: string): Observable<MapPool []> {
    return this.http.get<MapPool []>(`${this._apiEndpoint}/teams/mapPool?teamId=${teamId}`, { withCredentials: true });
  }

  public setTeamMapPool(mapstatus: MapPool []): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/teams/mapPool`, mapstatus, { withCredentials: true });
  }

  public submitStrategy(strat: TeamStrategy): Observable<any> {
    return this.http.post(`${this._apiEndpoint}/teams/strategy`, strat, { withCredentials: true });
  }

  public setTeamPractice(day: Availability) {
    return this.http.put(`${this._apiEndpoint}/teams/availability`, day, { withCredentials: true });
  }

  public getUser(userId: string): Observable<CSGOPlayer> {
    return this.http.get<CSGOPlayer>(`${this._apiEndpoint}/users/user?userid=${userId}`);
  }

  public setAvailability(availability: Availability): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/availability`, availability, { withCredentials: true });
  }

  public setPrimaryRole(role: Role): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/primaryrole`, role, { withCredentials: true });
  }

  public setSecondaryRole(role: Role): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/secondaryrole`, role, { withCredentials: true });
  }

  public setMapPool(mapstatus: MapPool): Observable<any> {
    return this.http.put(`${this._apiEndpoint}/users/mapPool`, mapstatus, { withCredentials: true });
  }

  public acceptInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/acceptTeamInvite`, notification, { withCredentials: true });
  }

  public rejectInvite(notification: UserNotification) {
    return this.http.put(`${this._apiEndpoint}/users/rejectTeamInvite`, notification, { withCredentials: true });
  }
}
