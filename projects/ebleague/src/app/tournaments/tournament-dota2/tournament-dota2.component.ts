import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiTournamentsService, LoginService } from 'bellum-gens-common/services';
import { environment } from 'bellum-gens-common/environments';
import { BaseDirective } from '../../../../../bellumgens/src/app/base/base.component';
import { mediaQuery, NARROW_SCREEN_QUERY } from '../../utils/media-query';
import { dota2DireTeamId, dota2SeriesDrawn, dota2SeriesPlayed, dota2SortedGames, dota2TeamName } from '../../utils/dota2-series';
import { DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IgxDividerComponent } from '@infragistics/igniteui-angular/directives';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
  selector: 'app-tournament-dota2',
  templateUrl: './tournament-dota2.component.html',
  styleUrls: ['./tournament-dota2.component.scss'],
  imports: [
    DatePipe,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IgxBadgeComponent,
    IgxDividerComponent,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent
  ]
})
export class TournamentDota2Component extends BaseDirective {
  private apiService = inject(ApiTournamentsService);
  private loginService = inject(LoginService);

  public environment = environment;
  public authUser = this.loginService.applicationUser;
  // An empty tournament id loads the active tournament's data
  public tournamentId = toSignal(
    this.activeRoute.params.pipe(map(params => (params['tournamentid'] as string | undefined) ?? '')),
    { initialValue: '' }
  );
  public tournament = computed(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getTournament(id)() : this.apiService.activeTournament();
  });
  public loading = this.apiService.loadingDota2Registrations;
  public registrations = computed(() => this.apiService.getDota2Registrations(this.tournamentId())());
  public loadingMatches = this.apiService.loadingDota2Matches;
  public dota2matches = computed(() => this.apiService.getDota2Matches(this.tournamentId())());
  public loadingGroups = this.apiService.loadingDota2Groups;
  public groups = computed(() => this.apiService.getDota2Groups(this.tournamentId())());
  public narrowScreen = mediaQuery(NARROW_SCREEN_QUERY);

  public teamName = dota2TeamName;
  public direTeamId = dota2DireTeamId;
  public played = dota2SeriesPlayed;
  public drawn = dota2SeriesDrawn;
  public sortedGames = dota2SortedGames;

  constructor() {
    super();
    // Results change during a live event, so entering the page always re-fetches them
    effect(() => {
      const id = this.tournamentId();
      this.apiService.refreshDota2Registrations(id);
      this.apiService.refreshDota2Matches(id);
      this.apiService.refreshDota2Groups(id);
    });
  }
}
