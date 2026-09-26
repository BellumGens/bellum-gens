import { Component, inject, input, signal, viewChild } from '@angular/core';
import {
  ApplicationUser,
  BellumgensApiService,
  CSGOTeam,
  SteamGroup,
  EMPTY_NEW_TEAM
} from '../../../../../common/src/public_api';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { Router } from '@angular/router';
import { GroupsFilterPipe } from '../../pipes/groups-filter.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss'],
  imports: [
    IgxDialogComponent,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    FormsModule,
    IGX_LIST_DIRECTIVES,
    IgxAvatarComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    GroupsFilterPipe
  ]
})
export class TeamNewComponent {
  private apiService = inject(BellumgensApiService);
  private router = inject(Router);

  public authUser = input<ApplicationUser>();

  public createTeam = viewChild(IgxDialogComponent);

  public groups = signal<SteamGroup []>(undefined);
  public searchGroups = signal<string>(undefined);
  public newTeam = Object.assign({}, EMPTY_NEW_TEAM);
  public navigateOnCreate = true;
  public inProgress = signal(false);

  public open(navigate = true) {
    this.navigateOnCreate = navigate;
    this.apiService.getPlayerGroups(this.authUser().steamId).subscribe(groups => this.groups.set(groups));
    this.createTeam().open();
  }

  public createFromSteam(group: SteamGroup) {
    this.inProgress.set(true);
    this.apiService.registerSteamGroup(group).subscribe({
      next: team => this.teamCreated(team),
      error: () => this.inProgress.set(false)
    });
  }

  public createFromForm() {
    this.inProgress.set(true);
    this.apiService.registerTeam(this.newTeam).subscribe({
      next: team => this.teamCreated(team),
      error: () => this.inProgress.set(false)
    });
  }

  private teamCreated(team: CSGOTeam) {
    this.inProgress.set(false);
    this.createTeam().close();
    if (this.navigateOnCreate) {
      this.router.navigate(['/team', team.customUrl]);
    }
  }
}
