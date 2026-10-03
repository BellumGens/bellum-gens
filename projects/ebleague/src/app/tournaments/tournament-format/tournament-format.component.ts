import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgxButtonDirective, IgxDividerComponent } from '@infragistics/igniteui-angular/directives';

@Component({
    selector: 'app-tournament-format',
    templateUrl: './tournament-format.component.html',
    styleUrls: ['./tournament-format.component.scss'],
    imports: [IgxButtonDirective, RouterLink, IgxDividerComponent]
})
export class TournamentFormatComponent {
  public compStart = '28ми септември 2020';
}
