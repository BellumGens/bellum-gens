import { Component } from '@angular/core';
import { Tournament } from '../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent {
  public tournaments: Tournament [];
  public past: Tournament [];
  public upcoming: Tournament [];

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.tournaments.subscribe(data => {
      if (data) {
        this.tournaments = data.filter(t => t.active);
        this.past = data.filter(t => new Date(t.endDate).getTime() < Date.now());
        this.upcoming = data.filter(t => new Date(t.startDate).getTime() > Date.now());
      }
    });
  }

}
