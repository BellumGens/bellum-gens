import { Component} from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import {
  ApplicationUser,
  CSGOTeam, TEAM_PLACEHOLDER,
  BellumgensApiService,
  LoginService
} from '../../../../common/src/public_api';
import { BaseDirective } from '../base/base.component';
import { IgxIconService, IgxIconComponent, IGX_TABS_DIRECTIVES, IgxAvatarComponent } from '@infragistics/igniteui-angular';
import { TeamApplicationComponent } from './team-application/team-application.component';

@Component({
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss'],
    standalone: true,
    imports: [
      IgxAvatarComponent,
      NgIf,
      TeamApplicationComponent,
      IgxIconComponent,
      IGX_TABS_DIRECTIVES,
      RouterLinkActive,
      RouterLink,
      RouterOutlet
    ]
})
export class TeamComponent extends BaseDirective {
  public authUser: ApplicationUser;
  public team: CSGOTeam = TEAM_PLACEHOLDER;
  public isAdmin = false;
  public isMember = false;

  constructor(private apiService: BellumgensApiService,
              private authManager: LoginService,
              private iconService: IgxIconService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      this.authUser = data;
    });
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
    });
  }

  private loadSvgs() {
    this.iconService.addSvgIcon('discord-full-logo', '/assets/login/discord.svg', 'login-icons');
  }

}
