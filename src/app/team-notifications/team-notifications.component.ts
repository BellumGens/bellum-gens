import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from '../models/applicationuser';
import { CSGOTeam } from '../models/csgoteam';
import { TeamApplication } from '../models/usernotifications';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  authUser: ApplicationUser;
  teamId: string;
  applications: TeamApplication[];
  notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private authManager: LoginService) {
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      this.authUser = data;
    });

    this.activatedRoute.params.subscribe(params => {
      this.teamId = params['teamid'];

      if (this.teamId) {
        this.apiService.getTeamApplications(this.teamId).subscribe(data => {
          this.applications = data;
        });
      }
    });
  }

  ngOnInit() {
  }

}
