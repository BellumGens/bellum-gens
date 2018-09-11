import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { SteamUserWithStats } from '../models/steamuser';
import { BellumgensApiService } from '../services/bellumgens-api.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent {
  public searchPlayer: string;

  public activeUsers: SteamUserWithStats[];

  @ViewChild(IgxListComponent) public players: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
    this.apiManager.getActiveUsers();
    this.apiManager.activeUsers.subscribe((data: SteamUserWithStats[]) => {
      this.activeUsers = data;
      this.players.isLoading = false;
    });
  }
}
