import { Component, ViewChild, Input } from '@angular/core';
import {
  ApplicationUser,
  BellumgensApiService,
  SteamGroup,
  EMPTY_NEW_TEAM
} from '../../../../../common/src/public_api';
import { IgxDialogComponent } from '@infragistics/igniteui-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss']
})
export class TeamNewComponent {
  @Input() public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;

  public groups: SteamGroup [];
  public searchGroups: string;
  public newTeam = Object.assign({}, EMPTY_NEW_TEAM);
  public navigateOnCreate = true;
  public inProgress = false;

  constructor(private apiService: BellumgensApiService, private router: Router) {
  }

  public open(navigate = true) {
    this.navigateOnCreate = navigate;
    this.apiService.getPlayerGroups(this.authUser.id).subscribe(groups => this.groups = groups);
    this.createTeam.open();
  }

  public createFromSteam(group: SteamGroup) {
    this.inProgress = true;
    this.apiService.registerSteamGroup(group).subscribe(
      team => {
        this.inProgress = false;
        this.createTeam.close();
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.customUrl]);
        }
      },
      () => this.inProgress = false
    );
  }

  public createFromForm() {
    this.inProgress = true;
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.inProgress = false;
        this.createTeam.close();
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.customUrl]);
        }
      },
      () => this.inProgress = false
    );
  }

}
