import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { IgxFilterOptions, IgxListComponent } from 'igniteui-angular';
import { SteamUserWithStats } from '../models/steamuser';
import { BellumgensApiService } from '../services/bellumgens-api.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
  public searchPlayer: string;

  public activeUsers: SteamUserWithStats[];

  @ViewChild(IgxListComponent) public list: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
    this.apiManager.getActiveUsers();
    this.apiManager.activeUsers.subscribe((data: SteamUserWithStats[]) => {
      this.activeUsers = data;
      this.list.isLoading = false;
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
