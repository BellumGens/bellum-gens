import { Component, Input } from '@angular/core';
import {
  PLAYER_SEARCH,
  PlayerSearch,
  PlaystyleRole,
  ApplicationUser,
  LoginService,
  CSGOTeam
} from '../../../../../common/src/public_api';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { IgxRadioModule, IgxSelectModule, IgxInputGroupModule, IgxAvatarModule, IgxSliderModule, IgxButtonModule, IgxRippleModule } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-player-search',
    templateUrl: './player-search.component.html',
    styleUrls: ['./player-search.component.scss'],
    standalone: true,
    imports: [FormsModule, IgxRadioModule, NgFor, NgIf, IgxSelectModule, IgxInputGroupModule, IgxAvatarModule, IgxSliderModule, IgxButtonModule, IgxRippleModule]
})
export class PlayerSearchComponent {

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

  constructor(private router: Router, private authManager: LoginService) {
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
