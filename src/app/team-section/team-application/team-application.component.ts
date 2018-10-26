import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxDialogComponent } from 'igniteui-angular';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { TeamApplication } from 'src/app/models/csgoteam';
import { NotificationState } from 'src/app/models/usernotifications';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-team-application',
  templateUrl: './team-application.component.html',
  styleUrls: ['./team-application.component.css']
})
export class TeamApplicationComponent implements OnInit {
  public authUser: ApplicationUser;
  public application: TeamApplication = {
    TeamId: '',
    ApplicantId: '',
    State: NotificationState.NotSeen,
    Sent: '',
    Message: '',
    UserInfo: null
  };

  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;
  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;

  constructor(private activatedRoute: ActivatedRoute,
    private apiService: BellumgensApiService,
    private authManager: LoginService) {
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
        this.application.ApplicantId = data.SteamUser.steamID64;
      });

      this.activatedRoute.params.subscribe(params => this.application.TeamId = params['teamid']);
    }

  ngOnInit() {
  }

  public submitApplication() {
    this.apiService.submitApplication(this.application).subscribe(
      data => this.toast.showSuccess('Application submitted'),
      error => this.toast.showError(error.error.Message)
    );
  }
}
