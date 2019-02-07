import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { CSGOTeam } from 'src/app/models/csgoteam';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css']
})
export class TeamResultsComponent implements OnInit {
  public isLoading = true;
  public teamResults: CSGOTeam [];

  constructor(private route: ActivatedRoute,
              private apiService: BellumgensApiService) {
    this.route.params.subscribe(params => {
      if (params.query) {
        this.apiService.searchTeams(params.query);
      }
    });
  }

  ngOnInit() {
  }

}
