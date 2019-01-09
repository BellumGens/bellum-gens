import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PlaystyleRole } from 'src/app/models/playerrole';
import { TeamSearch, TEAM_SEARCH } from 'src/app/models/csgoteam';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.css']
})
export class TeamSearchComponent implements OnInit {
  public searchModel: TeamSearch = TEAM_SEARCH;

  @Output()
  public search: EventEmitter<TeamSearch> = new EventEmitter<TeamSearch>();

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor() { }

  ngOnInit() {
  }

  public searchTeams() {
    this.search.emit(this.searchModel);
  }

}
