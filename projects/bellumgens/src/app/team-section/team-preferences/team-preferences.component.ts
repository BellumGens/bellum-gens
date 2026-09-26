import { Component, Injector, Signal, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import {
  BellumgensApiService,
  CSGOTeam, TeamMember,
  ApplicationUser,
  LoginService,
  CountrySVGPipe
} from '../../../../../common/src/public_api';
import { RouterLink, ROUTER_OUTLET_DATA } from '@angular/router';
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
  private injector = inject(Injector);

  // Handed down by the parent TeamComponent through the router outlet. The form edits it in place.
  public team = inject(ROUTER_OUTLET_DATA) as Signal<CSGOTeam>;
  public teammembers = signal<TeamMember []>(undefined);

  public authUser: Signal<ApplicationUser> = this.authService.applicationUser;

  constructor() {
    toObservable(this.team).pipe(
      map(team => team?.teamId),
      filter(teamId => !!teamId),
      distinctUntilChanged(),
      switchMap(teamId => toObservable(this.apiService.getTeamMembers(teamId), { injector: this.injector })),
      takeUntilDestroyed()
    ).subscribe(members => this.teammembers.set(members));
  }

  public updateTeamInfo() {
    this.apiService.updateTeam(this.team()).subscribe();
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
