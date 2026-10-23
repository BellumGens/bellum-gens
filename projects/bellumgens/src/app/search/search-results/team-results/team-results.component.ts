import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiSearchService } from '../../../../../../common/src/public_api';
import { BaseDirective } from '../../../base/base.component';
import { QueryParsedPipe } from '../../../pipes/query-parsed.pipe';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { LoadingComponent } from '../../../../../../common/src/lib/loading/loading.component';


@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css'],  imports: [
    LoadingComponent,
    IGX_CARD_DIRECTIVES,
    RouterLink,
    IgxAvatarComponent,
    QueryParsedPipe
  ]
})
export class TeamResultsComponent extends BaseDirective {
  private apiService = inject(ApiSearchService);

  public teams = this.apiService.teamSearchResult;
  public loading = this.apiService.loadingSearch;
  public query = signal<string>(null);

  constructor() {
    super();
    this.activeRoute.params.subscribe(params => {
      if (params.query) {
        this.query.set(params.query);
        this.apiService.searchTeams(params.query);
      }
    });
  }
}
