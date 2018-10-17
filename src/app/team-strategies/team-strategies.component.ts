import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from '../models/applicationuser';
import { CSGOTeam } from '../models/csgoteam';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent implements OnInit {
  public authUser: ApplicationUser;
  public team: CSGOTeam;

  constructor(private activatedRoute: ActivatedRoute,
    private apiService: BellumgensApiService,
    private authManager: LoginService) {
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
      });

      this.activatedRoute.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => this.team = team);
        }
      });
    }

  ngOnInit() {
  }

}
