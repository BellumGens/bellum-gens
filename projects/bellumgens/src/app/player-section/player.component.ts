import { Component, ViewEncapsulation } from '@angular/core';

import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    IGX_TABS_DIRECTIVES,
    RouterLinkActive
  ]
})
export class PlayerComponent {
  constructor() {
  }
}
