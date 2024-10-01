import { Component } from '@angular/core';
import {
  CSGOTeam, TeamMember,
  ApplicationUser,
  BellumgensApiService,
  LoginService,
  ConfirmComponent
} from '../../../../../common/src/public_api';
import { Observable } from 'rxjs';
import { TeamNewComponent } from '../team-new/team-new.component';
import { RouterLink } from '@angular/router';
import {
  IgxButtonDirective,
  IgxRippleDirective,
  IgxIconComponent,
  IGX_CARD_DIRECTIVES,
  IgxAvatarComponent
} from '@infragistics/igniteui-angular';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-team-nav',
  templateUrl: './team-nav.component.html',
  styleUrls: ['./team-nav.component.scss'],
  standalone: true,
  imports: [
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IGX_CARD_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    TeamNewComponent,
    ConfirmComponent,
    AsyncPipe
  ]
})
export class TeamNavComponent {
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public teams: Observable<CSGOTeam []>;

  public authUser: ApplicationUser;

  constructor(private authService: LoginService, private apiService: BellumgensApiService) {
    this.authService.applicationUser.subscribe(user => {
      this.authUser = user;
      if (user) {
        this.teams = this.apiService.getUserTeams(user.id);
      }
    });
  }

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe();
}
}
