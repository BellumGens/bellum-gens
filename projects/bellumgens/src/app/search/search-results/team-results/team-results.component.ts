import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CSGOTeam, ApiSearchService } from '../../../../../../common/src/public_api';
import { BaseDirective } from '../../../base/base.component';
import { QueryParsedPipe } from '../../../pipes/query-parsed.pipe';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { LoadingComponent } from '../../../../../../common/src/lib/loading/loading.component';


@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css'],
  imports: [
    LoadingComponent,
    IGX_CARD_DIRECTIVES,
    RouterLink,
    IgxAvatarComponent,
    QueryParsedPipe
  ]
})
export class TeamResultsComponent extends BaseDirective {
  private apiService = inject(ApiSearchService);

  public teams: CSGOTeam [];
  public loading = false;
  public query: string;

  constructor() {
    super();
    this.activeRoute.params.subscribe(params => {
      if (params.query) {
        this.query = params.query;
        this.apiService.searchTeams(params.query);
      }
    });
    this.apiService.loadingSearch.subscribe(loading => this.loading = loading);
    this.apiService.teamSearchResult.subscribe(players => this.teams = players);
  }
}
