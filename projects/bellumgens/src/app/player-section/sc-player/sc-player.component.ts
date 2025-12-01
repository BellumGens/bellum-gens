import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApplicationUser, BellumgensApiService, LoadingComponent, RaceIconPipe, Tournament } from '../../../../../common/src/public_api';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-sc-player',
  imports: [
    IgxAvatarComponent,
    IgxIconComponent,
    LoadingComponent,
    IGX_GRID_DIRECTIVES,
    AsyncPipe,
    DatePipe,
    RaceIconPipe
  ],
  templateUrl: './sc-player.component.html',
  styleUrl: './sc-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPlayerComponent {
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private apiService = inject(BellumgensApiService);

  public loading: Observable<boolean>;
  public player: ApplicationUser;
  public tournaments: Observable<Tournament []>;

  constructor() {
    this.activatedRoute.parent.params.subscribe(params => {
      const userid = params['userid'];
      if (userid) {
        this.apiService.getPlayer(userid).subscribe(
          player => {
            if (player) {
              this.player = player;
              if (player && !player.steamUserException) {
                this.titleService.setTitle('StarCraft II Player: ' + player.sc2Details?.battleNetBattleTag);
              }
              this.tournaments = this.apiService.getPlayerTournaments(player.id);
            }
          }
        );
        this.loading = this.apiService.loadingPlayer;
      }
    });
  }
}
