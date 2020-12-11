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

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.tournaments.subscribe(data => this.tournaments = data);
  }

}
