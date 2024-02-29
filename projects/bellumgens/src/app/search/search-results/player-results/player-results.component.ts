import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ALL_ROLES, CSGOPlayer, ApiSearchService } from '../../../../../../common/src/public_api';
import { BaseComponent } from '../../../base/base.component';
import { IgxIconService, IgxCardModule, IgxAvatarModule, IgxProgressBarModule, IgxIconModule, IgxChipsModule } from '@infragistics/igniteui-angular';
import { Title, Meta } from '@angular/platform-browser';
import { QueryParsedPipe } from '../../../pipes/query-parsed.pipe';
import { LoadingComponent } from '../../../../../../common/src/lib/loading/loading.component';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-player-results',
    templateUrl: './player-results.component.html',
    styleUrls: ['./player-results.component.css'],
    standalone: true,
    imports: [NgIf, LoadingComponent, NgFor, IgxCardModule, RouterLink, IgxAvatarModule, IgxProgressBarModule, IgxIconModule, IgxChipsModule, DecimalPipe, QueryParsedPipe]
})
export class PlayerResultsComponent extends BaseComponent {
  public players: CSGOPlayer [];
  public loading = false;
  public roles = ALL_ROLES;
  public query: string;

  constructor(private iconService: IgxIconService,
              private apiService: ApiSearchService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.activeRoute.params.subscribe(params => {
      if (params.query) {
        this.query = params.query;
        this.apiService.searchPlayers(params.query);
      }
    });
    this.apiService.loadingSearch.subscribe(loading => this.loading = loading);
    this.apiService.playerSearchResult.subscribe(players => this.players = players);
    this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
  }

}
