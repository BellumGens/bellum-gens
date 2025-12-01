import { Component, inject } from '@angular/core';
import {
  BellumgensApiService,
  CSGOTeam, TeamMember,
  ApplicationUser,
  LoginService,
  CountrySVGPipe
} from '../../../../../common/src/public_api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxSwitchComponent } from '@infragistics/igniteui-angular/switch';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css'],
  imports: [
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    IgxSwitchComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IGX_LIST_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    CountrySVGPipe
  ]
})
export class TeamPreferencesComponent {
  private apiService = inject(BellumgensApiService);
  private authService = inject(LoginService);
  private activeRoute = inject(ActivatedRoute);

  public team: CSGOTeam;
  public teammembers: TeamMember [];

  public authUser: ApplicationUser;

  constructor() {
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
