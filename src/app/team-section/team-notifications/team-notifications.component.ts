import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxListComponent } from 'igniteui-angular';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { TeamApplication } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';

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
              private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const teamId = params['teamid'];
      this.apiService.teamApplications(teamId).subscribe(data => {
        this.applications = data;
        this.notifications.isLoading = false;
      });
    });
  }

  public approveApplication(application: TeamApplication) {
    this.apiService.approveApplication(application).subscribe(data => application = data);
  }

  public rejectApplication(application: TeamApplication) {
    this.apiService.rejectApplication(application).subscribe(data => application = data);
  }
}
