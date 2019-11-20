import { Component, Input } from '@angular/core';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../../../../src-common/models/csgoteam';
import { SteamUserSummary } from '../../../../src-common/models/steamuser';
import { BaseComponent } from '../../base/base.component';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

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
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.subs.push(
      this.activeRoute.parent.params.subscribe(params => {
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
