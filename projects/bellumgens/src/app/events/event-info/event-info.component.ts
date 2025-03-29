import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { BaseDirective } from '../../base/base.component';
import { TournamentParticipant, TournamentSC2Match, Tournament, ApiTournamentsService, CountrySVGPipe, RaceIconPipe } from '../../../../../common/src/public_api';
import { IGX_CARD_DIRECTIVES, IgxCircularProgressBarComponent, IgxAvatarComponent, IGX_GRID_DIRECTIVES, IgxIconComponent, IgxButtonDirective, IGroupingExpression, SortingDirection, DefaultSortingStrategy } from '@infragistics/igniteui-angular';
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
  public registrations: Observable<TournamentParticipant []>;
  // public groups: Observable<TournamentGroup []>;
  public loading: Observable<boolean>;
  public loadingMatches: Observable<boolean>;
  public tournamentId: string;
  public sc2matches: Observable<TournamentSC2Match []>;
  public tournament: Tournament;
  public grouping: IGroupingExpression [];
  public signUpDisabled = false;

  constructor(private apiService: ApiTournamentsService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.loading = this.apiService.loadingSC2Registrations;
    this.loadingMatches = this.apiService.loadingSC2Matches;
    this.activeRoute.params.subscribe(params => {
      if (params['tournamentId']) {
        this.tournamentId = params['tournamentId'];
        if (this.tournamentId === '1fe0af1f-7dfc-4476-db4d-08dd4cd5c5da' ||
            this.tournamentId === '0232380e-c3d1-4c49-db4e-08dd4cd5c5da' ||
            this.tournamentId === '9f2f02af-c09b-4d97-db4f-08dd4cd5c5da') {
          this.signUpDisabled = true;
        }
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
