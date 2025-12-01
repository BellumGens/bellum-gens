import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseDirective } from '../../base/base.component';
import { TournamentParticipant, TournamentSC2Match, Tournament, ApiTournamentsService, CountrySVGPipe, RaceIconPipe } from '../../../../../common/src/public_api';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { DefaultSortingStrategy, IGroupingExpression, SortingDirection } from '@infragistics/igniteui-angular/core';
import { Observable } from 'rxjs';


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
    AsyncPipe,
    RaceIconPipe
  ],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoComponent extends BaseDirective {
  private apiService = inject(ApiTournamentsService);

  public registrations: Observable<TournamentParticipant []>;
  // public groups: Observable<TournamentGroup []>;
  public loading: Observable<boolean>;
  public loadingMatches: Observable<boolean>;
  public tournamentId: string;
  public sc2matches: Observable<TournamentSC2Match []>;
  public tournament: Tournament;
  public grouping: IGroupingExpression [];
  public signUpDisabled = false;
  public closedTournaments = [
    '1fe0af1f-7dfc-4476-db4d-08dd4cd5c5da',
    '0232380e-c3d1-4c49-db4e-08dd4cd5c5da',
    '9f2f02af-c09b-4d97-db4f-08dd4cd5c5da',
    '5670bc9c-26e4-44d8-db50-08dd4cd5c5da',
    '0e92f9ed-ca3d-450f-70e3-08dd81aa33d9'
  ];

  constructor() {
    super();
    this.loading = this.apiService.loadingSC2Registrations;
    this.loadingMatches = this.apiService.loadingSC2Matches;
    this.activeRoute.params.subscribe(params => {
      if (params['tournamentId']) {
        this.tournamentId = params['tournamentId'];
        this.signUpDisabled = this.closedTournaments.some(t => {
          return t === this.tournamentId;
        });
      }
      this.apiService.getTournament(this.tournamentId).subscribe(t => {
        if (t) {
          this.tournament = t;
          this.registrations = this.apiService.getSc2Registrations(this.tournamentId);
          this.sc2matches = this.apiService.getSc2Matches(this.tournamentId);
          this.titleService.setTitle(t.name);
          this.meta.updateTag({ name: 'description', content: t.description });
          this.meta.updateTag({ name: 'twitter:title', content: t.name });
          this.meta.updateTag({ name: 'twitter:description', content: t.description });
          this.meta.updateTag({ name: 'og:image', content: t.logo });
          this.meta.updateTag({ name: 'og:title', content: t.name });
          this.meta.updateTag({ name: 'og:description', content: t.description });
          // this.groups = this.apiService.getSc2Groups(this.tournamentId);
        }
      });
    });
    this.grouping = [
      { dir: SortingDirection.Desc, fieldName: 'startTime', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
    ];
  }

  // public refreshGroups() {
  //   this.groups = this.apiService.getSc2Groups(this.tournamentId);
  // }

  public refreshMatches() {
    this.sc2matches = this.apiService.getSc2Matches(this.tournamentId);
  }
}
