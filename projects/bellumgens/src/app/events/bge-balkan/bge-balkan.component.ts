import { Component, computed, inject, effect } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { RouterLink } from '@angular/router';
import { ApiTournamentsService, CountrySVGPipe, RaceIconPipe } from '../../../../../common/src/public_api';
import { DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective, IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
import { DefaultSortingStrategy, IGroupingExpression, SortingDirection } from '@infragistics/igniteui-angular/core';

@Component({
  selector: 'app-bge-balkan',
  templateUrl: './bge-balkan.component.html',
  styleUrl: './bge-balkan.component.scss',
  imports: [
    DatePipe,
    RouterLink,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    IgxButtonDirective,
    IgxIconButtonDirective,
    CountrySVGPipe,
    RaceIconPipe
  ]
})
export class BgeBalkanComponent extends BaseDirective {
  private apiService = inject(ApiTournamentsService);

  public bgeBalkanId = '0313a19e-d527-46f9-bbea-08dd07ccaf69';

  public tournament = this.apiService.getTournament(this.bgeBalkanId);
  public tournamentId = computed(() => this.tournament()?.id);
  // The tournament's data is loaded once the tournament itself is known
  public registrations = computed(() => this.tournamentId() ? this.apiService.getSc2Registrations(this.tournamentId())() : undefined);
  public groups = computed(() => this.tournamentId() ? this.apiService.getSc2Groups(this.tournamentId())() : undefined);
  public sc2matches = computed(() => this.tournamentId() ? this.apiService.getSc2Matches(this.tournamentId())() : undefined);
  public loading = this.apiService.loadingSC2Registrations;
  public loadingMatches = this.apiService.loadingSC2Matches;
  public grouping: IGroupingExpression [] = [
    { dir: SortingDirection.Desc, fieldName: 'startTime', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
  ];

  constructor() {
    super();
    // Results change during a live event, so entering the page always re-fetches them
    effect(() => {
      const id = this.tournamentId();
      if (id) {
        this.apiService.refreshSc2Registrations(id);
        this.apiService.refreshSc2Matches(id);
        this.apiService.refreshSc2Groups(id);
      }
    });
  }

  public refreshGroups() {
    this.apiService.refreshSc2Groups(this.tournamentId());
  }

  public refreshMatches() {
    this.apiService.refreshSc2Matches(this.tournamentId());
  }
}
