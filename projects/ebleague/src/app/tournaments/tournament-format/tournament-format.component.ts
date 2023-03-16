import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgxButtonModule, IgxDividerModule } from '@infragistics/igniteui-angular';

@Component({
    selector: 'app-tournament-format',
    templateUrl: './tournament-format.component.html',
    styleUrls: ['./tournament-format.component.scss'],
    standalone: true,
    imports: [IgxButtonModule, RouterLink, IgxDividerModule]
})
export class TournamentFormatComponent {
  public compStart = '28ми септември 2020';

  constructor() { }

}
