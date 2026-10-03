import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  CSGOTeam, TeamMember,
  BellumgensApiService,
  LoginService,
  ConfirmComponent
} from '../../../../../common/src/public_api';
import { filter, switchMap } from 'rxjs/operators';
import { TeamNewComponent } from '../team-new/team-new.component';
import { RouterLink } from '@angular/router';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';

@Component({
  selector: 'app-team-nav',
  templateUrl: './team-nav.component.html',
  styleUrls: ['./team-nav.component.scss'],
  imports: [
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IGX_CARD_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    TeamNewComponent,
    ConfirmComponent
  ]
})
export class TeamNavComponent {
  private authService = inject(LoginService);
  private apiService = inject(BellumgensApiService);

  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public authUser = this.authService.applicationUser;

  public teams = toSignal(toObservable(this.authUser).pipe(
    filter(user => !!user),
    switchMap(user => this.apiService.getUserTeams(user.id))
  ));

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe();
  }
}
