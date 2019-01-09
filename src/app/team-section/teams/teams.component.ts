import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { CSGOTeam, TeamSearch } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  public csgoTeams: CSGOTeam [];

  @ViewChild('teams') public teams: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
  }

  ngOnInit() {
    this.apiManager.csgoTeams().subscribe(data => {
      this.csgoTeams = data;
      this.teams.isLoading = false;
    });
  }

  public search(term: TeamSearch) {
    this.teams.isLoading = true;
    this.apiManager.csgoTeams(term).subscribe(data => {
      this.csgoTeams = data;
      this.teams.isLoading = false;
    });
  }
}
