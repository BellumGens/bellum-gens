import { Component, OnInit } from '@angular/core';
import { PlaystyleRole } from 'src/app/models/playerrole';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { TeamSearch } from 'src/app/models/csgoteam';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.css']
})
export class TeamSearchComponent implements OnInit {
  public searchModel: TeamSearch = {
    name: '',
    role: null,
    scheduleOverlap: 0
  };

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public searchTeams() {
    this.apiService.filterTeams(this.searchModel).subscribe();
  }

}
