import { Component, Input } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../../models/csgoteam';
import { SteamUserSummary } from '../../models/steamuser';
import { BaseComponent } from '../../base/base.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css']
})
export class TeamPreferencesComponent extends BaseComponent {
  public team: CSGOTeam;
  public steamMembers: SteamUserSummary [];

  @Input()
  adminId: string;

  constructor(private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute) {
    super();
    this.subs.push(
      this.activatedRoute.parent.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => {
            if (team) {
              this.team = team;
              if (team.SteamGroup) {
                this.subs.push(this.apiService.getSteamMembers(team.SteamGroup.members).subscribe(data => this.steamMembers = data));
              }
            }
          });
        }
      })
    );
  }

  public updateTeamInfo() {
    this.apiService.updateTeam(this.team).subscribe();
  }

  public adminStatusUpdated(user: TeamMember) {
    if (user.IsAdmin) {
      user.IsEditor = true;
    }
    this.editorStatusUpdated(user);
  }

  public editorStatusUpdated(user: TeamMember) {
    this.apiService.updateTeamMember(user).subscribe();
  }
}
