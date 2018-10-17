import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { CSGOTeam } from '../models/csgoteam';

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.css']
})
export class TeamOverviewComponent implements OnInit {
  authUser: ApplicationUser;
  team: CSGOTeam;

  constructor(private activatedRoute: ActivatedRoute,
    private apiService: BellumgensApiService,
    private authManager: LoginService) {
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
      });

      this.activatedRoute.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => {
            this.team = team;
          });
        }
      });
    }

  ngOnInit() {
  }

}
