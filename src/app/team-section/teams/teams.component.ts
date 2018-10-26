import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { CSGOTeam } from 'src/app/models/csgoteam';
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
    this.apiManager.csgoTeams.subscribe((data: CSGOTeam[]) => {
      this.csgoTeams = data;
      this.teams.isLoading = false;
    });
  }
}
