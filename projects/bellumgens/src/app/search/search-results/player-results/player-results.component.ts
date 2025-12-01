import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ALL_ROLES, ApiSearchService, ApplicationUser } from '../../../../../../common/src/public_api';
import { BaseDirective } from '../../../base/base.component';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_CHIPS_DIRECTIVES } from '@infragistics/igniteui-angular/chips';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { QueryParsedPipe } from '../../../pipes/query-parsed.pipe';
import { LoadingComponent } from '../../../../../../common/src/lib/loading/loading.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-player-results',
  templateUrl: './player-results.component.html',
  styleUrls: ['./player-results.component.css'],
  imports: [
    LoadingComponent,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    RouterLink,
    IgxAvatarComponent,
    IgxIconComponent,
    IGX_CHIPS_DIRECTIVES,
    DecimalPipe,
    QueryParsedPipe
  ]
})
export class PlayerResultsComponent extends BaseDirective {
  private iconService = inject(IgxIconService);
  private apiService = inject(ApiSearchService);

  public players: ApplicationUser [];
  public loading = false;
  public roles = ALL_ROLES;
  public query: string;

  constructor() {
    super();
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
