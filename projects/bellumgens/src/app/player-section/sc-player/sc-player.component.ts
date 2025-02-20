import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApplicationUser, BellumgensApiService, LoadingComponent, Tournament } from '../../../../../common/src/public_api';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IGX_GRID_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from '@infragistics/igniteui-angular';
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
    DatePipe
  ],
  templateUrl: './sc-player.component.html',
  styleUrl: './sc-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPlayerComponent {
  public loading: Observable<boolean>;
  public player: ApplicationUser;
  public tournaments: Observable<Tournament []>;

  constructor(private activatedRoute: ActivatedRoute, private titleService: Title, private apiService: BellumgensApiService) {
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
