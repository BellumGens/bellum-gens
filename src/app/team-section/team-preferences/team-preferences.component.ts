import { Component, OnInit, Input } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../../models/csgoteam';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css']
})
export class TeamPreferencesComponent implements OnInit {
  @Input()
  team: CSGOTeam;

  @Input()
  adminId: string;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public updateTeamInfo() {
    this.apiService.updateTeam(this.team).subscribe(team => this.team = team);
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
