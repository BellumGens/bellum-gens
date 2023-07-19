import { Component } from '@angular/core';
import { Tournament, ApiTournamentsService } from '../../../../../common/src/public_api';
import { RouterLink } from '@angular/router';
import { IgxCardModule, IgxDividerModule } from '@infragistics/igniteui-angular';
import { NgIf, NgFor, DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-tournaments-main',
    templateUrl: './tournaments-main.component.html',
    styleUrls: ['./tournaments-main.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgOptimizedImage, DatePipe, IgxCardModule, RouterLink, IgxDividerModule]
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
