import { Component, Input } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../../models/csgoteam';
import { SteamUserSummary } from 'src/app/models/steamuser';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css']
})
export class TeamPreferencesComponent {
  private _team: CSGOTeam;

  public steamMembers: SteamUserSummary [];

  @Input()
  public set team(team: CSGOTeam) {
    if (team) {
      this._team = team;
      if (team.SteamGroup) {
        this.apiService.getSteamMembers(team.TeamId, team.SteamGroup.members).subscribe(data => this.steamMembers = data);
      }
    }
  }

  public get team() {
    return this._team;
  }

  @Input()
  adminId: string;

  constructor(private apiService: BellumgensApiService) { }

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
