import { Component, inject } from '@angular/core';
import { Tournament, ApiTournamentsService } from '../../../../../common/src/public_api';
import { RouterLink } from '@angular/router';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxDividerDirective } from '@infragistics/igniteui-angular/directives';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-tournaments-main',
  templateUrl: './tournaments-main.component.html',
  styleUrls: ['./tournaments-main.component.scss'],
  imports: [
    NgOptimizedImage,
    DatePipe,
    IGX_CARD_DIRECTIVES,
    RouterLink,
    IgxDividerDirective
  ]
})
export class TournamentsMainComponent {
  private apiService = inject(ApiTournamentsService);

  public tournaments: Tournament [];
  public past: Tournament [];
  public upcoming: Tournament [];

  constructor() {
    this.apiService.tournaments.subscribe(data => {
      if (data) {
        this.tournaments = data.filter(t => t.active);
        this.past = data.filter(t => new Date(t.endDate).getTime() < Date.now());
        this.upcoming = data.filter(t => new Date(t.startDate).getTime() > Date.now());
      }
    });
  }
}
