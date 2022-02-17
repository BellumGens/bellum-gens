import { Component } from '@angular/core';
import { PlaystyleRole, TeamSearch, TEAM_SEARCH, ApplicationUser } from '../../../../../common/src/public_api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.scss']
})
export class TeamSearchComponent {
  public searchModel: TeamSearch = TEAM_SEARCH;

  public authUser: ApplicationUser;

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor(private router: Router) { }

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
