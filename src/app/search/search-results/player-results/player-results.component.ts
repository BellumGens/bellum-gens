import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ALL_ROLES } from '../../../models/playerrole';
import { BaseComponent } from '../../../base/base.component';
import { IgxIconService } from 'igniteui-angular';
import { ApplicationUser } from '../../../models/applicationuser';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-player-results',
  templateUrl: './player-results.component.html',
  styleUrls: ['./player-results.component.css']
})
export class PlayerResultsComponent extends BaseComponent {
  public players: ApplicationUser [];
  public loading = false;
  public roles = ALL_ROLES;
  public query: string;

  constructor(private apiService: BellumgensApiService,
              private iconService: IgxIconService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.subs.push(
      this.activeRoute.params.subscribe(params => {
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
