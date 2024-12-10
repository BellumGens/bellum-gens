import { Component, ViewEncapsulation } from '@angular/core';

import { IGX_TABS_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from '@infragistics/igniteui-angular';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
  constructor() {
  }
}
