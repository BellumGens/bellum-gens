import { Component } from '@angular/core';
import { CSGOTeam, TeamMember } from '../../../../src-common/models/csgoteam';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { LoginService } from 'src-common/services/login.service';

@Component({
  selector: 'app-team-nav',
  templateUrl: './team-nav.component.html',
  styleUrls: ['./team-nav.component.scss']
})
export class TeamNavComponent {
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];

  public authUser: ApplicationUser;

  constructor(private authService: LoginService, private apiService: BellumgensApiService) {
    this.authService.applicationUser.subscribe(user => this.authUser = user);
  }

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe(
      _ => this.authUser.teams.splice(this.authUser.teams.indexOf(team), 1)
    );
}
}
