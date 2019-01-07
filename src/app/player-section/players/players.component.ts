import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOPlayer } from '../../models/csgoplayer';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
  public activeUsers: CSGOPlayer[];

  @ViewChild(IgxListComponent) public players: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
  }

  ngOnInit() {
    this.apiManager.activeUsers.subscribe((data: CSGOPlayer[]) => {
      this.activeUsers = data;
      this.players.isLoading = false;
    });
  }
}
