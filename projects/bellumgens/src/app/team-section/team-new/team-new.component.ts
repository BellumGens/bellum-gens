import { Component, ViewChild, Input, inject } from '@angular/core';
import {
  ApplicationUser,
  BellumgensApiService,
  SteamGroup,
  EMPTY_NEW_TEAM
} from '../../../../../common/src/public_api';
import {
  IgxDialogComponent,
  IGX_INPUT_GROUP_DIRECTIVES,
  IgxIconComponent,
  IGX_LIST_DIRECTIVES,
  IgxAvatarComponent,
  IgxButtonDirective,
  IgxRippleDirective
} from '@infragistics/igniteui-angular';
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

  @Input() public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;

  public groups: SteamGroup [];
  public searchGroups: string;
  public newTeam = Object.assign({}, EMPTY_NEW_TEAM);
  public navigateOnCreate = true;
  public inProgress = false;

  public open(navigate = true) {
    this.navigateOnCreate = navigate;
    this.apiService.getPlayerGroups(this.authUser.steamId).subscribe(groups => this.groups = groups);
    this.createTeam.open();
  }

  public createFromSteam(group: SteamGroup) {
    this.inProgress = true;
    this.apiService.registerSteamGroup(group).subscribe({
      next: team => {
        this.inProgress = false;
        this.createTeam.close();
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.customUrl]);
        }
      },
      error: () => this.inProgress = false
    });
  }

  public createFromForm() {
    this.inProgress = true;
    this.apiService.registerTeam(this.newTeam).subscribe({
      next: team => {
        this.inProgress = false;
        this.createTeam.close();
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.customUrl]);
        }
      },
      error: () => this.inProgress = false
    });
  }

}
