import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApplicationUser, BellumgensApiService } from '../../../../../common/src/public_api';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-sc-player',
  imports: [
    IgxAvatarComponent
  ],
  templateUrl: './sc-player.component.html',
  styleUrl: './sc-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPlayerComponent {
  public loading = true;
  public player: ApplicationUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private apiService: BellumgensApiService,
  ) {
    this.activatedRoute.parent.params.subscribe(params => {
      const userid = params['userid'];
      if (userid) {
        this.apiService.getPlayer(userid).subscribe(
            player => {
              if (player) {
                this.player = player;
                if (player && !player.steamUserException) {
                  this.titleService.setTitle('StarCraft II Player: ' + player.steamUser.steamID);
                }
              }
            }
          );
          this.apiService.loadingPlayer.subscribe(loading => this.loading = loading);
      }
    });
  }
}
