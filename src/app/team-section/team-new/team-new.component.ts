import { Component, ViewChild, Input } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { IgxDialogComponent } from 'igniteui-angular';
import { Router } from '@angular/router';
import { SteamGroup } from '../../models/steamuser';
import { getEmptyNewTeam } from '../../models/csgoteam';
import { CSGOPlayer } from '../../models/csgoplayer';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss']
})
export class TeamNewComponent extends BaseComponent {
  @Input()
  public authUser: ApplicationUser;
  public player: CSGOPlayer;
  public searchGroups: string;
  public newTeam = getEmptyNewTeam();
  public navigateOnCreate = true;
  public inProgress = false;

  @ViewChild(IgxDialogComponent, { static: false }) public createTeam: IgxDialogComponent;

  constructor(private apiService: BellumgensApiService, private router: Router) {
    super();
  }

  public open(navigate = true) {
    this.navigateOnCreate = navigate;
    this.subs.push(this.apiService.getPlayer(this.authUser.id).subscribe(player => this.player = player));
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
          this.router.navigate(['/team', team.CustomUrl]);
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
          this.router.navigate(['/team', team.CustomUrl]);
        }
      },
      _ => this.inProgress = false
    );
  }

}
