import { Component, Input, inject } from '@angular/core';
import {
  PLAYER_SEARCH,
  PlayerSearch,
  PlaystyleRole,
  ApplicationUser,
  LoginService,
  CSGOTeam
} from '../../../../../common/src/public_api';
import { Router } from '@angular/router';

import { IGX_RADIO_GROUP_DIRECTIVES, IGX_SELECT_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IgxAvatarComponent, IGX_SLIDER_DIRECTIVES, IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.scss'],
  imports: [
    FormsModule,
    IGX_RADIO_GROUP_DIRECTIVES,
    IGX_SELECT_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxAvatarComponent,
    IGX_SLIDER_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective
  ]
})
export class PlayerSearchComponent {
  private router = inject(Router);
  private authManager = inject(LoginService);


  @Input()
  public authUser: ApplicationUser;
  public teamAdmin: CSGOTeam [];
  public searchModel: PlayerSearch = PLAYER_SEARCH;
  public userOverlap = 0;
  public teamName = 'Select Team';
  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];
  public parseInt = parseInt;

  constructor() {
    this.authManager.teamsAdmin.subscribe(teams => this.teamAdmin = teams);
  }

  public searchPlayers() {
    if (!this.userOverlap) {
      this.teamName = 'Select Team';
      this.searchModel.teamId = null;
    }
    this.router.navigate(['search/players', this.searchQuery]);
  }

  private get searchQuery() {
    let query = '';
    if (this.searchModel.role != null) {
      query = `role=${this.searchModel.role}&`;
    }
    if (this.searchModel.teamId) {
      query += `teamid=${this.searchModel.teamId}&`;
    }
    return `${query}overlap=${this.searchModel.scheduleOverlap}`;
  }

}
