import { Component, ViewChild, Input } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { IgxDialogComponent } from 'igniteui-angular';
import { Router } from '@angular/router';
import { SteamGroup } from '../../models/steamuser';
import { getEmptyNewTeam } from '../../models/csgoteam';

@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss']
})
export class TeamNewComponent {
  @Input()
  public authUser: ApplicationUser;
  public searchGroups: string;
  public newTeam = getEmptyNewTeam();
  public navigateOnCreate = true;
  public inProgress = false;

  @ViewChild(IgxDialogComponent, { static: false }) public createTeam: IgxDialogComponent;

  constructor(private apiService: BellumgensApiService, private router: Router) {
  }

  public open(navigate = true) {
    this.navigateOnCreate = navigate;
    this.createTeam.open();
  }

  public createFromSteam(group: SteamGroup) {
    this.apiService.registerSteamGroup(group).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.teams.push(team);
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.CustomUrl]);
        }
      }
    );
  }

  public createFromForm() {
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.teams.push(team);
        if (this.navigateOnCreate) {
          this.router.navigate(['/team', team.CustomUrl]);
        }
      }
    );
  }

}
