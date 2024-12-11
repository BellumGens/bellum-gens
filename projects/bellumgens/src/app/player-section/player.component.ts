import { Component, ViewEncapsulation } from '@angular/core';

import { IGX_TABS_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from '@infragistics/igniteui-angular';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApplicationUser, LoginService } from '../../../../common/src/public_api';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    IGX_TABS_DIRECTIVES,
    IgxIconComponent,
    IgxAvatarComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class PlayerComponent {
  public authUser: ApplicationUser;

  constructor(private authManager: LoginService) {
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      if (data) {
        this.authUser = data;
      }
    });
  }
}
