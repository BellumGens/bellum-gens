import { Component } from '@angular/core';
import { Tournament, ApiTournamentsService } from '../../../../../common/src/public_api';

@Component({
  selector: 'app-tournaments-main',
  templateUrl: './tournaments-main.component.html',
  styleUrls: ['./tournaments-main.component.scss']
})
export class TournamentsMainComponent {
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
