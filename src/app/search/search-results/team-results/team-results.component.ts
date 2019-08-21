import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { CSGOTeam } from '../../../models/csgoteam';
import { BaseComponent } from '../../../base/base.component';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css']
})
export class TeamResultsComponent extends BaseComponent {
  public teams: CSGOTeam [];
  public loading = false;
  public query: string;

  constructor(private route: ActivatedRoute, private apiService: BellumgensApiService) {
    super();
    this.subs.push(
      this.route.params.subscribe(params => {
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
