import { ChangeDetectionStrategy, Component, effect, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationUser, BellumgensApiService, LoadingComponent, RaceIconPipe, Tournament } from '../../../../../common/src/public_api';
import { IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective } from '@infragistics/igniteui-angular/card';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sc-player',
  imports: [
    IgxAvatarComponent,
    IgxIconComponent,
    LoadingComponent,
    IGX_GRID_DIRECTIVES,
    IgxCardHeaderTitleDirective,
    IgxCardHeaderSubtitleDirective,
    DatePipe,
    RaceIconPipe
  ],
  templateUrl: './sc-player.component.html',
  styleUrl: './sc-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPlayerComponent {
  private titleService = inject(Title);
  private apiService = inject(BellumgensApiService);

  // Handed down by the parent PlayerComponent through the router outlet.
  public player = inject(ROUTER_OUTLET_DATA) as Signal<ApplicationUser>;

  public loading = toSignal(this.apiService.loadingPlayer, { initialValue: false });
  public tournaments = signal<Tournament []>([]);

  private tournamentsLoadedFor: string;

  constructor() {
    effect(() => {
      const player = this.player();
      if (!player) {
        return;
      }
      if (!player.steamUserException) {
        this.titleService.setTitle('StarCraft II Player: ' + player.sc2Details?.battleNetBattleTag);
      }
      if (this.tournamentsLoadedFor === player.id) {
        return;
      }
this.tournamentsLoadedFor = player.id;
      this.tournaments.set([]);
      this.apiService.getPlayerTournaments(player.id).subscribe(tournaments => {
        if (this.player()?.id === player.id) {
          this.tournaments.set(tournaments);
        }
      });
    });
  }
}
