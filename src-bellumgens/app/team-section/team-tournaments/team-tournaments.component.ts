import { Component } from '@angular/core';
import { Tournament } from '../../../../src-common/models/tournament';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { CSGOTeam } from '../../../../src-common/models/csgoteam';

@Component({
  selector: 'app-team-tournaments',
  templateUrl: './team-tournaments.component.html',
  styleUrls: ['./team-tournaments.component.scss']
})
export class TeamTournamentsComponent {
  public tournaments: Tournament [];
  public team: CSGOTeam;
  public emptyGuid = '00000000-0000-0000-0000-000000000000';

  constructor(private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent.params.subscribe(params => {
      const teamId = params['teamid'];
      if (teamId) {
        this.apiService.getTeam(teamId).subscribe(team => this.team = team);
        this.apiService.getTeamTournaments(teamId).subscribe(data => this.tournaments = data);
      }
    });
  }

}
