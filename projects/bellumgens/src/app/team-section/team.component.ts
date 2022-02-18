import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApplicationUser,
  CSGOTeam, TEAM_PLACEHOLDER,
  BellumgensApiService,
  LoginService
} from '../../../../common/src/public_api';
import { BaseComponent } from '../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { IgxIconService } from '@infragistics/igniteui-angular';

@Component({
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public team: CSGOTeam = TEAM_PLACEHOLDER;
  public isAdmin: boolean = null;
  public isMember: boolean = null;

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
              this.authManager.getUserIsTeamMember(team.teamId).subscribe(data => this.isMember = data);
              this.authManager.getUserIsTeamAdmin(team.teamId).subscribe(data => this.isAdmin = data);
              this.titleService.setTitle('CS:GO Team: ' + team.teamName);
              this.loadSvgs();
            }
          });
        }
      })
    );
  }

  private loadSvgs() {
    if (!this.iconService.isSvgIconCached('discord-full-logo', 'login-icons')) {
      this.iconService.addSvgIcon('discord-full-logo', '/assets/login/discord.svg', 'login-icons');
    }
  }

}
