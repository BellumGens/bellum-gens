import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TournamentParticipant, TournamentGroup, TournamentSC2Match, Tournament, ApiTournamentsService, CountrySVGPipe } from '../../../../../common/src/public_api';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES, IgxCircularProgressBarComponent, IgxAvatarComponent, IgxDividerDirective, IGX_GRID_DIRECTIVES, IgxIconComponent, IgxButtonDirective, IGroupingExpression, SortingDirection, DefaultSortingStrategy } from '@infragistics/igniteui-angular';
import { Observable } from 'rxjs';

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
    IgxDividerDirective,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    IgxButtonDirective,
    CountrySVGPipe,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgeBalkanComponent extends BaseDirective {
  public registrations: Observable<TournamentParticipant []>;
  public groups: Observable<TournamentGroup []>;
  public loading = true;
  public loadingMatches = true;
  public loadingGroups = true;
  public tournamentId: string;
  public sc2matches: Observable<TournamentSC2Match []>;
  public tournament: Tournament;
  public grouping: IGroupingExpression [];

  public bgeBalkanId = '0313a19e-d527-46f9-bbea-08dd07ccaf69';

  constructor(private apiService: ApiTournamentsService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
    this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
    this.apiService.loadingSC2Groups.subscribe(data => this.loadingGroups = data);
    this.apiService.activeTournament.subscribe(t => {
      if (t) {
        this.tournament = t;
        this.tournamentId = t.id;
        this.registrations = this.apiService.getSc2Registrations(this.tournamentId);
        this.sc2matches = this.apiService.getSc2Matches(this.tournamentId);
        this.groups = this.apiService.getSc2Groups(this.tournamentId);
      }
    });
    this.grouping = [
      { dir: SortingDirection.Desc, fieldName: 'startTime', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
    ];
  }
}
