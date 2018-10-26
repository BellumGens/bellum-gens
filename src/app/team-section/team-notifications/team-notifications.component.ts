import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxListComponent } from 'igniteui-angular';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { TeamApplication } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificationState } from 'src/app/models/usernotifications';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';

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
  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

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

  public approveApplication(application: TeamApplication) {
    this.apiService.approveApplication(application).subscribe(
      data => {
        application.State = NotificationState.Accepted;
        this.toast.showSuccess('Player is now part of your team.');
      },
      error => this.toast.showError(error.error.Message)
    );
  }

  public rejectApplication(application: TeamApplication) {
    this.apiService.rejectApplication(application).subscribe(
      data => {
        application.State = NotificationState.Rejected;
        this.toast.showSuccess('Player application rejected...');
      },
      error => this.toast.showError(error.error.Message)
    );
  }
}
