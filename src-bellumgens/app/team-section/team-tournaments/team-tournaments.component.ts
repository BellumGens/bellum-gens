import { Component } from '@angular/core';
import { Tournament } from '../../../../src-common/models/tournament';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';

@Component({
  selector: 'app-team-tournaments',
  templateUrl: './team-tournaments.component.html',
  styleUrls: ['./team-tournaments.component.scss']
})
export class TeamTournamentsComponent {
  public tournaments: Tournament [];

  constructor(private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent.params.subscribe(params => {
      const teamId = params['teamid'];
      if (teamId) {
        this.apiService.getTeamTournaments(teamId).subscribe(data => this.tournaments = data);
      }
    });
  }

}
