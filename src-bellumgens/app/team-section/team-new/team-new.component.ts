import { Component, ViewChild, Input } from '@angular/core';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { IgxDialogComponent } from '@infragistics/igniteui-angular';
import { Router } from '@angular/router';
import { SteamGroup } from '../../../../src-common/models/steamuser';
import { getEmptyNewTeam } from '../../../../src-common/models/csgoteam';

@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss']
})
export class TeamNewComponent {
  @Input()
  public authUser: ApplicationUser;
  public groups: SteamGroup [];
  public searchGroups: string;
  public newTeam = getEmptyNewTeam();
  public navigateOnCreate = true;
  public inProgress = false;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;

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
        this.authUser.teams.push(team);
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.customUrl]);
        }
      },
      _ => this.inProgress = false
    );
  }

  public createFromForm() {
    this.inProgress = true;
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.inProgress = false;
        this.createTeam.close();
        this.authUser.teams.push(team);
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.customUrl]);
        }
      },
      _ => this.inProgress = false
    );
  }

}
