import { Component, ViewEncapsulation } from '@angular/core';

import { IGX_TABS_DIRECTIVES, IgxAvatarComponent } from '@infragistics/igniteui-angular';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApplicationUser, BellumgensApiService } from '../../../../common/src/public_api';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    IGX_TABS_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class PlayerComponent {
  public player: ApplicationUser;

  constructor(private apiService: BellumgensApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      if (userid) {
        this.apiService.getPlayer(userid).subscribe(
          player => {
            if (player) {
              this.player = player;
            }
          }
        );
      }
    });
  }
}
