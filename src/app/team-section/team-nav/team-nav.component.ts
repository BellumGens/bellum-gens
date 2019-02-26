import { Component, ViewChild, Input } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';
import { Router } from '@angular/router';
import { CSGOTeam, TeamMember } from '../../models/csgoteam';
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
  public newTeam: CSGOTeam = {
    TeamName: '',
    TeamAvatar: '',
    Description: '',
    Discord: '',
    Visible: true,
    TeamId: undefined,
    PracticeSchedule: [],
    Members: undefined
  };
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];

  @Input()
  public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;

  constructor(private apiService: BellumgensApiService,
              public router: Router) {
  }

  public createFromSteam(group: SteamGroup): void {
    this.apiService.registerSteamGroup(group).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.Teams.push(team);
      }
    );
  }

  public createFromForm(): void {
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.Teams.push(team);
      }
    );
  }

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe(
      _ => this.authUser.Teams.splice(this.authUser.Teams.indexOf(team), 1)
    );
}
}
