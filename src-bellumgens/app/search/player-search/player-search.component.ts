import { Component } from '@angular/core';
import { PLAYER_SEARCH, PlayerSearch } from '../../../../src-common/models/csgoplayer';
import { PlaystyleRole } from '../../../../src-common/models/playerrole';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { Router } from '@angular/router';
import { LoginService } from '../../../../src-common/services/login.service';
import { CSGOTeam } from '../../../../src-common/models/csgoteam';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.scss']
})
export class PlayerSearchComponent {
  public searchModel: PlayerSearch = PLAYER_SEARCH;

  public authUser: ApplicationUser;
  public teamAdmin: CSGOTeam [];

  public userOverlap = 0;

  public teamName = 'Select Team';

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor(private router: Router, private authManager: LoginService) {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.authUser = user;
        this.authManager.teamsAdmin.subscribe(teams => this.teamAdmin = teams);
      }
    });
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
