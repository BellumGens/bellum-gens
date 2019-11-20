import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CSGOTeam, TeamMember } from '../../../../src-common/models/csgoteam';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';

@Component({
  selector: 'app-team-nav',
  templateUrl: './team-nav.component.html',
  styleUrls: ['./team-nav.component.css']
})
export class TeamNavComponent {
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];

  @Input()
  public authUser: ApplicationUser;

  constructor(private apiService: BellumgensApiService) {
  }

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe(
      _ => this.authUser.teams.splice(this.authUser.teams.indexOf(team), 1)
    );
}
}
