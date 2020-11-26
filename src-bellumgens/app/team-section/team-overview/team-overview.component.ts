import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { CSGOTeam, TEAM_PLACEHOLDER } from '../../../../src-common/models/csgoteam';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { LoginService } from '../../../../src-common/services/login.service';
import { BaseComponent } from '../../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { IgxIconService } from '@infragistics/igniteui-angular';

@Component({
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.css']
})
export class TeamOverviewComponent extends BaseComponent {
  authUser: ApplicationUser;
  team: CSGOTeam = TEAM_PLACEHOLDER;

  private _isAdmin: boolean = null;
  private _isEditor: boolean = null;
  private _isMember: boolean = null;

  constructor(private apiService: BellumgensApiService,
              private authManager: LoginService,
              private iconService: IgxIconService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.subs.push(
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
      }),
      this.activeRoute.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => {
            if (team) {
              this.team = team;
              this.titleService.setTitle('CS:GO Team: ' + team.teamName);
            }
          });
        }
      })
    );
    this.loadSvgs();
  }

  public get userIsMember() {
    if (this._isMember !== null) {
      return this._isMember;
    }
    if (this.authUser && this.team && this.team.members) {
      this._isMember = this.team.members.filter(m => m.UserId === this.authUser.id).length > 0;
    }
    return this._isMember;
  }

  public get userIsAdmin() {
    if (this._isAdmin !== null) {
      return this._isAdmin;
    }
    if (this.authUser && this.team && this.team.members) {
      this._isAdmin = this.team.members.filter(m => m.IsAdmin && m.UserId === this.authUser.id).length > 0;
    }
    return this._isAdmin;
  }

  public get userIsEditor() {
    if (this._isEditor !== null) {
      return this._isEditor;
    }
    if (this.authUser && this.team && this.team.members) {
      this._isEditor = this.team.members.filter(m => m.IsEditor && m.UserId === this.authUser.id).length > 0;
    }
    return this._isEditor;
  }

  private loadSvgs() {
    this.iconService.addSvgIcon('discord-full-logo', '/assets/login/discord.svg', 'login-icons');
  }

}
