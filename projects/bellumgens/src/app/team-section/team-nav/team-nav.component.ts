import { Component, inject, linkedSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  CSGOTeam,
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

  public authUser = this.authService.applicationUser;

  private userTeams = toSignal(toObservable(this.authUser).pipe(
    filter(user => !!user),
    switchMap(user => this.apiService.getUserTeams(user.id))
  ));
  // Reloaded with the user's teams and updated locally when a team is abandoned
  public teams = linkedSignal(() => this.userTeams());

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe({
      next: () => this.teams.update(teams => teams?.filter(t => t.teamId !== team.teamId)),
      // The service already tells the user; the team just stays in the list
      error: () => {}
    });
  }
}
