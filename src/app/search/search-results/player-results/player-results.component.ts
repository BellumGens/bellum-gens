import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { CSGOPlayer } from '../../../models/csgoplayer';
import { ALL_ROLES } from '../../../models/playerrole';
import { BaseComponent } from '../../../base/base.component';
import { IgxIconService } from 'igniteui-angular';

@Component({
  selector: 'app-player-results',
  templateUrl: './player-results.component.html',
  styleUrls: ['./player-results.component.css']
})
export class PlayerResultsComponent extends BaseComponent {
  public players: CSGOPlayer [];
  public loading = false;
  public roles = ALL_ROLES;
  public query: string;

  constructor(private route: ActivatedRoute, private apiService: BellumgensApiService, private iconService: IgxIconService) {
    super();
    this.subs.push(
      this.route.params.subscribe(params => {
        if (params.query) {
          this.query = params.query;
          this.apiService.searchPlayers(params.query);
        }
      }),
      this.apiService.loadingSearch.subscribe(loading => this.loading = loading),
      this.apiService.playerSearchResult.subscribe(players => this.players = players)
    );
    this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
  }

}
