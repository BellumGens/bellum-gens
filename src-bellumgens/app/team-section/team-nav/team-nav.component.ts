import { Component } from '@angular/core';
import { CSGOTeam, TeamMember } from '../../../../src-common/models/csgoteam';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { LoginService } from '../../../../src-common/services/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-nav',
  templateUrl: './team-nav.component.html',
  styleUrls: ['./team-nav.component.scss']
})
export class TeamNavComponent {
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public teams: Observable<CSGOTeam []>;

  public authUser: ApplicationUser;

  constructor(private authService: LoginService, private apiService: BellumgensApiService) {
    this.authService.applicationUser.subscribe(user => {
      this.authUser = user;
      if (user) {
        this.teams = this.apiService.getUserTeams(user.id);
      }
    });
  }

  public abandonTeam(team: CSGOTeam) {
    this.apiService.abandonTeam(team).subscribe();
}
}
