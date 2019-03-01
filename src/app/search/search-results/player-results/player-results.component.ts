import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { CSGOPlayer } from '../../../models/csgoplayer';

@Component({
  selector: 'app-player-results',
  templateUrl: './player-results.component.html',
  styleUrls: ['./player-results.component.css']
})
export class PlayerResultsComponent {
  public players: CSGOPlayer [];
  public loading = true;

  constructor(private route: ActivatedRoute,
              private apiService: BellumgensApiService) {
    this.route.params.subscribe(params => {
      if (params.query) {
        this.apiService.searchPlayers(params.query);
      }
    });
    this.apiService.loadingSearch.subscribe(loading => this.loading = loading);
    this.apiService.playerSearchResult.subscribe(players => this.players = players);
  }

}
