import { Component, OnInit, Input } from '@angular/core';
import { PlaystyleRole } from 'src/app/models/playerrole';
import { TeamSearch, TEAM_SEARCH } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { ApplicationUser } from 'src/app/models/applicationuser';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.css']
})
export class TeamSearchComponent implements OnInit {
  public searchModel: TeamSearch = TEAM_SEARCH;

  @Input()
  public authUser: ApplicationUser;

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor(private apiManager: BellumgensApiService) { }

  ngOnInit() {
  }

  public searchTeams() {
    this.apiManager.searchTeams(this.searchModel);
  }

}
