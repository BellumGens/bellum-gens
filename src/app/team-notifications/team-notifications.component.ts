import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser } from '../models/applicationuser';
import { TeamApplication } from '../models/csgoteam';
import { IgxListComponent } from 'igniteui-angular';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  authUser: ApplicationUser;
  teamId: string;
  notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  applications: TeamApplication[];

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

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
          this.notifications.isLoading = false;
        });
      }
    });
  }

  ngOnInit() {
  }

}
