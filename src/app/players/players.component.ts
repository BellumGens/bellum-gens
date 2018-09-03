import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { IgxFilterOptions, IgxListComponent } from 'igniteui-angular';
import { SteamUserWithStats } from '../models/steamuser';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { CSGOTeam } from '../models/csgoteam';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
  public searchPlayer: string;

  public activeUsers: SteamUserWithStats[];
  public csgoTeams: CSGOTeam [];

  @ViewChild('players') public players: IgxListComponent;
  @ViewChild('teams') public teams: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
    this.apiManager.getActiveUsers();
    this.apiManager.activeUsers.subscribe((data: SteamUserWithStats[]) => {
      this.activeUsers = data;
      this.players.isLoading = false;
    });
    this.apiManager.getTeams();
    this.apiManager.csgoTeams.subscribe((data: CSGOTeam[]) => {
      this.csgoTeams = data;
      this.teams.isLoading = false;
    });
  }

  ngOnInit() { }

  get filterPlayers() {
    const fo = new IgxFilterOptions();
    fo.key = 'steamID';
    fo.inputValue = this.searchPlayer;
    return fo;
  }
}
