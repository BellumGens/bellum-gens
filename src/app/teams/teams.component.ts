import { Component, OnInit, ViewChild } from '@angular/core';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { IgxListComponent } from 'igniteui-angular';
import { CSGOTeam } from '../models/csgoteam';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  public csgoTeams: CSGOTeam [];

  @ViewChild('teams') public teams: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
    this.apiManager.getTeams();
  }

  ngOnInit() {
    this.apiManager.csgoTeams.subscribe((data: CSGOTeam[]) => {
      this.csgoTeams = data;
      this.teams.isLoading = false;
    });
  }
}
