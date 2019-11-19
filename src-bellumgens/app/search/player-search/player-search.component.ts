import { Component, Input } from '@angular/core';
import { PLAYER_SEARCH, PlayerSearch } from '../../models/csgoplayer';
import { PlaystyleRole } from '../../models/playerrole';
import { ApplicationUser } from '../../models/applicationuser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent {
  public searchModel: PlayerSearch = PLAYER_SEARCH;

  @Input()
  public authUser: ApplicationUser;

  public userOverlap = 0;

  public teamName = 'Select Team';

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor(private router: Router) { }

  public searchPlayers() {
    if (!this.userOverlap) {
      this.teamName = 'Select Team';
      this.searchModel.teamId = null;
    }
    this.router.navigate(['search/players', this.searchQuery]);
  }

  private get searchQuery() {
    return `role=${this.searchModel.role}&overlap=${this.searchModel.scheduleOverlap}&teamid=${this.searchModel.teamId}`;
  }

}
