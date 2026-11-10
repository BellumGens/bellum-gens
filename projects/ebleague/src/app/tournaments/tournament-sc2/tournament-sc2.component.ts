import { Component, computed, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BaseDirective } from '../../../../../bellumgens/src/app/base/base.component';
import { mediaQuery, NARROW_SCREEN_QUERY } from '../../utils/media-query';
import { ApiTournamentsService, LoginService } from 'bellum-gens-common/services';
import { environment } from 'bellum-gens-common/environments';
import { Sc2MapNamePipe } from 'bellum-gens-common/pipes';
import { DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IgxDividerComponent } from '@infragistics/igniteui-angular/directives';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
  selector: 'app-tournament-sc2',
  templateUrl: './tournament-sc2.component.html',
  styleUrls: ['./tournament-sc2.component.scss'],
  imports: [
    DatePipe,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IgxBadgeComponent,
    IgxDividerComponent,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    Sc2MapNamePipe
  ]
})
export class TournamentSc2Component extends BaseDirective {
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
  public loading = this.apiService.loadingSC2Registrations;
  public registrations = computed(() => this.apiService.getSc2Registrations(this.tournamentId())());
  public loadingMatches = this.apiService.loadingSC2Matches;
  public sc2matches = computed(() => this.apiService.getSc2Matches(this.tournamentId())());
  public loadingGroups = this.apiService.loadingSC2Groups;
  public groups = computed(() => this.apiService.getSc2Groups(this.tournamentId())());
  public narrowScreen = mediaQuery(NARROW_SCREEN_QUERY);

  constructor() {
    super();
    // Results change during a live event, so entering the page always re-fetches them
    effect(() => {
      const id = this.tournamentId();
      this.apiService.refreshSc2Registrations(id);
      this.apiService.refreshSc2Matches(id);
      this.apiService.refreshSc2Groups(id);
    });
  }
}
