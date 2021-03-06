import { Component } from '@angular/core';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../../../../src-common/models/csgoteam';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { LoginService } from '../../../../src-common/services/login.service';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css']
})
export class TeamPreferencesComponent {
  public team: CSGOTeam;
  public teammembers: TeamMember [];

  public authUser: ApplicationUser;

  constructor(private apiService: BellumgensApiService,
              private authService: LoginService,
              private activeRoute: ActivatedRoute) {
    this.authService.applicationUser.subscribe(user => this.authUser = user);
    this.activeRoute.parent.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId) {
        this.apiService.getTeam(teamId).subscribe(team => {
          if (team) {
            this.team = team;
            this.apiService.getTeamMembers(team.teamId).subscribe(members => this.teammembers = members);
          }
        });
      }
    });
  }

  public updateTeamInfo() {
    this.apiService.updateTeam(this.team).subscribe();
  }

  public adminStatusUpdated(user: TeamMember) {
    if (user.isAdmin) {
      user.isEditor = true;
    }
    this.editorStatusUpdated(user);
  }

  public editorStatusUpdated(user: TeamMember) {
    this.apiService.updateTeamMember(user).subscribe();
  }
}
