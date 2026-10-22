import { Component, computed, inject } from '@angular/core';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { RouterLink } from '@angular/router';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxDividerComponent, IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
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
    IgxDividerComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxChipComponent
  ]
})
export class TournamentsMainComponent {
  private apiService = inject(ApiTournamentsService);

  private allTournaments = this.apiService.tournaments;

  // Each tournament is listed in a single section: an active one only under the active seasons,
  // whatever its dates, while the upcoming and past seasons are picked by date from the inactive ones.
  public tournaments = computed(() => (this.allTournaments() ?? []).filter(t => t.active));
  private inactive = computed(() => (this.allTournaments() ?? []).filter(t => !t.active));
  public past = computed(() => this.inactive().filter(t => new Date(t.endDate!).getTime() < Date.now()));
  public upcoming = computed(() => this.inactive().filter(t => new Date(t.startDate!).getTime() > Date.now()));
}
