import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxListComponent } from 'igniteui-angular';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { TeamApplication } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { LoginService } from 'src/app/services/login.service';

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
