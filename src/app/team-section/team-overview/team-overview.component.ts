import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from '../../models/applicationuser';
import { CSGOTeam, TeamApplication, TEAM_PLACEHOLDER } from '../../models/csgoteam';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.css']
})
export class TeamOverviewComponent {
  authUser: ApplicationUser;
  team: CSGOTeam = TEAM_PLACEHOLDER;
  notifications: TeamApplication [];

  private _isAdmin: boolean = null;
  private _isEditor: boolean = null;
  private _isMember: boolean = null;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private authManager: LoginService) {
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      this.authUser = data;
    });

    this.activatedRoute.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId !== '0') {
        this.apiService.getTeam(teamId).subscribe(team => {
          this.team = team;
        });
        this.apiService.teamApplications(teamId).subscribe(data => {
          this.notifications = data;
        });
      }
    });
  }

  public get userIsMember() {
    if (this._isMember !== null) {
      return this._isMember;
    }
    if (this.authUser && this.team && this.team.Members) {
      this._isMember = this.team.Members.filter(m => m.UserId === this.authUser.SteamUser.steamID64).length > 0;
    }
    return this._isMember;
  }

  public get userIsAdmin() {
    if (this._isAdmin !== null) {
      return this._isAdmin;
    }
    if (this.authUser && this.team && this.team.Members) {
      this._isAdmin = this.team.Members.filter(m => m.IsAdmin && m.UserId === this.authUser.SteamUser.steamID64).length > 0;
    }
    return this._isAdmin;
  }

  public get userIsEditor() {
    if (this._isEditor !== null) {
      return this._isEditor;
    }
    if (this.authUser && this.team && this.team.Members) {
      this._isEditor = this.team.Members.filter(m => m.IsEditor && m.UserId === this.authUser.SteamUser.steamID64).length > 0;
    }
    return this._isEditor;
  }

}
