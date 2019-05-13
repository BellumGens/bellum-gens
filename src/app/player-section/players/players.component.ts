import { Component, ViewEncapsulation } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOPlayer } from '../../models/csgoplayer';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent extends BaseComponent {
  public activeUsers: CSGOPlayer[];
  public loading = true;

  constructor(private apiManager: BellumgensApiService) {
    super();
    this.subs.push(this.apiManager.players.subscribe((data: CSGOPlayer[]) => this.activeUsers = data));
    this.subs.push(this.apiManager.loadingPlayers.subscribe(loading => this.loading = loading));
  }
}
