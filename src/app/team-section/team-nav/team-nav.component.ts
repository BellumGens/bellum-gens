import { Component, ViewChild, Input } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';
import { Router } from '@angular/router';
import { CSGOTeam, TeamMember, getEmptyNewTeam } from '../../models/csgoteam';
import { ApplicationUser } from '../../models/applicationuser';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { SteamGroup } from '../../models/steamuser';

@Component({
  selector: 'app-team-nav',
  templateUrl: './team-nav.component.html',
  styleUrls: ['./team-nav.component.css']
})
export class TeamNavComponent {
  public searchGroups: string;
  public newTeam = getEmptyNewTeam();
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];

  @Input()
  public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;

  constructor(private apiService: BellumgensApiService,
              private router: Router) {
  }

  public createFromSteam(group: SteamGroup): void {
    this.apiService.registerSteamGroup(group).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.teams.push(team);
        this.router.navigate(['/team', team.CustomUrl]);
      }
    );
  }

  public createFromForm(): void {
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.teams.push(team);
        this.router.navigate(['/team', team.CustomUrl]);
      }
    );
  }

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe(
      _ => this.authUser.teams.splice(this.authUser.teams.indexOf(team), 1)
    );
}
}
