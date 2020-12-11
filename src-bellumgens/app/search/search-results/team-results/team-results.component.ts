import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CSGOTeam } from '../../../../../src-common/models/csgoteam';
import { BaseComponent } from '../../../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ApiSearchService } from '../../../../../src-common/services/bellumgens-api.search.service';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css']
})
export class TeamResultsComponent extends BaseComponent {
  public teams: CSGOTeam [];
  public loading = false;
  public query: string;

  constructor(private apiService: ApiSearchService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.subs.push(
      this.activeRoute.params.subscribe(params => {
        if (params.query) {
          this.query = params.query;
          this.apiService.searchTeams(params.query);
        }
      }),
      this.apiService.loadingSearch.subscribe(loading => this.loading = loading),
      this.apiService.teamSearchResult.subscribe(players => this.teams = players)
    );
  }
}
