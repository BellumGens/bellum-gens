import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CSGOTeam, ApiSearchService } from '../../../../../../common/src/public_api';
import { BaseDirective } from '../../../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { QueryParsedPipe } from '../../../pipes/query-parsed.pipe';
import { IgxCardModule, IgxAvatarModule } from '@infragistics/igniteui-angular';
import { LoadingComponent } from '../../../../../../common/src/lib/loading/loading.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-team-results',
    templateUrl: './team-results.component.html',
    styleUrls: ['./team-results.component.css'],
    standalone: true,
    imports: [NgIf, LoadingComponent, NgFor, IgxCardModule, RouterLink, IgxAvatarModule, QueryParsedPipe]
})
export class TeamResultsComponent extends BaseDirective {
  public teams: CSGOTeam [];
  public loading = false;
  public query: string;

  constructor(private apiService: ApiSearchService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
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
