import { Component, computed, inject, effect } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { RouterLink } from '@angular/router';
import { ApiTournamentsService } from 'bellum-gens-common/services';
import { CountrySVGPipe, ParticipantTeamPipe, RaceIconPipe } from 'bellum-gens-common/pipes';
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
    ParticipantTeamPipe,
    RaceIconPipe
  ]
})
export class BgeBalkanComponent extends BaseDirective {
  private apiService = inject(ApiTournamentsService);

  public bgeBalkanId = '0313a19e-d527-46f9-bbea-08dd07ccaf69';

  public tournament = this.apiService.getTournament(this.bgeBalkanId);
  public tournamentId = computed(() => this.tournament()?.id);
  // The tournament's data is loaded once the tournament itself is known
  public registrations = computed(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getSc2Registrations(id)() : null;
  });
  public groups = computed(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getSc2Groups(id)() : null;
  });
  public sc2matches = computed(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getSc2Matches(id)() : null;
  });
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
    const id = this.tournamentId();
    if (id) {
      this.apiService.refreshSc2Groups(id);
    }
  }

  public refreshMatches() {
    const id = this.tournamentId();
    if (id) {
      this.apiService.refreshSc2Matches(id);
    }
  }
}
