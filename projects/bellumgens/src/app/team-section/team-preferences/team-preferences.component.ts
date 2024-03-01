import { Component } from '@angular/core';
import {
  BellumgensApiService,
  CSGOTeam, TeamMember,
  ApplicationUser,
  LoginService,
  CountrySVGPipe
} from '../../../../../common/src/public_api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IGX_INPUT_GROUP_DIRECTIVES,
  IgxIconComponent,
  IgxSwitchComponent,
  IgxButtonDirective,
  IgxRippleDirective,
  IGX_LIST_DIRECTIVES,
  IgxAvatarComponent
} from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    IgxSwitchComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IGX_LIST_DIRECTIVES,
    NgFor,
    IgxAvatarComponent,
    RouterLink,
    CountrySVGPipe
  ]
})
export class TeamPreferencesComponent {
  public team: CSGOTeam;
  public teammembers: TeamMember [];

  public authUser: ApplicationUser;

  constructor(private apiService: BellumgensApiService,
              private authService: LoginService,
              private activeRoute: ActivatedRoute) {
    this.authService.applicationUser.subscribe(user => this.authUser = user);
    this.activeRoute.parent.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId) {
        this.apiService.getTeam(teamId).subscribe(team => {
          if (team) {
            this.team = team;
            this.apiService.getTeamMembers(team.teamId).subscribe(members => this.teammembers = members);
          }
        });
      }
    });
  }

  public updateTeamInfo() {
    this.apiService.updateTeam(this.team).subscribe();
  }

  public adminStatusUpdated(user: TeamMember) {
    if (user.isAdmin) {
      user.isEditor = true;
    }
    this.editorStatusUpdated(user);
  }

  public editorStatusUpdated(user: TeamMember) {
    this.apiService.updateTeamMember(user).subscribe();
  }
}
