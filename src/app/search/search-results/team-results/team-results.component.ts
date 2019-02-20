import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { CSGOTeam } from '../../../models/csgoteam';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css']
})
export class TeamResultsComponent implements OnInit {
  public teams: CSGOTeam [];
  public loading = true;
  public query: string;

  constructor(private route: ActivatedRoute,
              private apiService: BellumgensApiService) {
    this.route.params.subscribe(params => {
      if (params.query) {
        this.query = params.query;
        this.apiService.searchTeams(params.query);
      }
    });
  }

  ngOnInit() {
    this.apiService.loadingSearch.subscribe(loading => this.loading = loading);
    this.apiService.teamSearchResult.subscribe(players => this.teams = players);
  }

}
