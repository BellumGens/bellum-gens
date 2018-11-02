import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { CSGOTeam } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { LoginService } from 'src/app/services/login.service';
import { TeamStrategy } from 'src/app/models/csgoteamstrategy';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent implements OnInit {
  teamStrats: TeamStrategy [];

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId) {
        this.apiService.getTeamStrats(teamId).subscribe(strats => this.teamStrats = strats);
      }
    });
  }

}
