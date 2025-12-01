import { Component, Input, inject } from '@angular/core';
import { PlaystyleRole, TeamSearch, TEAM_SEARCH, ApplicationUser } from '../../../../../common/src/public_api';
import { Router } from '@angular/router';

import { IGX_RADIO_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/radio';
import { IGX_SLIDER_DIRECTIVES } from '@infragistics/igniteui-angular/slider';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.scss'],
  imports: [
    FormsModule,
    IGX_RADIO_GROUP_DIRECTIVES,
    IGX_SLIDER_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective
  ]
})
export class TeamSearchComponent {
  private router = inject(Router);


  @Input()
  public authUser: ApplicationUser;

  public searchModel: TeamSearch = TEAM_SEARCH;
  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  public parseInt = parseInt;

  public searchTeams() {
    this.router.navigate(['search/teams', this.searchQuery]);
  }

  private get searchQuery() {
    let query = '';
    if (this.searchModel.role != null) {
      query = `role=${this.searchModel.role}&`;
    }
    return `${query}overlap=${this.searchModel.scheduleOverlap}`;
  }
}
