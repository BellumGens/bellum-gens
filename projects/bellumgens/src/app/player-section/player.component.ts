import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';

import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApplicationUser, BellumgensApiService } from '../../../../common/src/public_api';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IGX_TABS_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class PlayerComponent {
  private apiService = inject(BellumgensApiService);
  private activatedRoute = inject(ActivatedRoute);

  public player = signal<ApplicationUser>(null);

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      if (userid) {
        this.apiService.getPlayer(userid).subscribe(
          player => {
            if (player) {
              this.player.set(player);
            }
          }
        );
      }
    });
  }
}
