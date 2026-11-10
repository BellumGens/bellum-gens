import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseDirective } from '../../base/base.component';
import { ApiTournamentsService } from 'bellum-gens-common/services';
import { CountrySVGPipe, ParticipantTeamPipe, RaceIconPipe } from 'bellum-gens-common/pipes';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { DefaultSortingStrategy, IGroupingExpression, SortingDirection } from '@infragistics/igniteui-angular/core';

@Component({
  selector: 'app-event-info',
  imports: [
    DatePipe,
    RouterLink,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    IgxButtonDirective,
    CountrySVGPipe,
    ParticipantTeamPipe,
    RaceIconPipe
  ],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss'
})
export class EventInfoComponent extends BaseDirective {
  private apiService = inject(ApiTournamentsService);

  public tournamentId = signal<string | undefined>(undefined);
  public tournament = computed(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getTournament(id)() : null;
  });
  public registrations = computed(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getSc2Registrations(id)() : null;
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
  public closedTournaments = [
    '1fe0af1f-7dfc-4476-db4d-08dd4cd5c5da',
    '0232380e-c3d1-4c49-db4e-08dd4cd5c5da',
    '9f2f02af-c09b-4d97-db4f-08dd4cd5c5da',
    '5670bc9c-26e4-44d8-db50-08dd4cd5c5da',
    '0e92f9ed-ca3d-450f-70e3-08dd81aa33d9'
  ];
  public signUpDisabled = computed(() => {
    const id = this.tournamentId();
    return !!id && this.closedTournaments.includes(id);
  });

  constructor() {
    super();
    this.activeRoute.params.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['tournamentId']) {
        this.tournamentId.set(params['tournamentId']);
      }
    });
    // Results change during a live event, so entering the page always re-fetches them
    effect(() => {
      const id = this.tournamentId();
      if (id) {
        this.apiService.refreshSc2Registrations(id);
        this.apiService.refreshSc2Matches(id);
      }
    });
    effect(() => {
      const t = this.tournament();
      if (t) {
        this.titleService.setTitle(t.name);
        this.meta.updateTag({ name: 'description', content: t.description ?? '' });
        this.meta.updateTag({ name: 'twitter:title', content: t.name });
        this.meta.updateTag({ name: 'twitter:description', content: t.description ?? '' });
        this.meta.updateTag({ name: 'og:image', content: t.logo ?? '' });
        this.meta.updateTag({ name: 'og:title', content: t.name });
        this.meta.updateTag({ name: 'og:description', content: t.description ?? '' });
      }
    });
  }

  public refreshMatches() {
    const id = this.tournamentId();
    if (id) {
      this.apiService.refreshSc2Matches(id);
    }
  }
}
