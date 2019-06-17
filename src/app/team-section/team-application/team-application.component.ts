import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxDialogComponent } from 'igniteui-angular';
import { ApplicationUser } from '../../models/applicationuser';
import { TeamApplication } from '../../models/csgoteam';
import { NotificationState } from '../../models/usernotifications';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-team-application',
  templateUrl: './team-application.component.html',
  styleUrls: ['./team-application.component.css']
})
export class TeamApplicationComponent extends BaseComponent {
  @Input()
  public authUser: ApplicationUser;
  public application: TeamApplication = {
    TeamId: '',
    ApplicantId: '',
    State: NotificationState.NotSeen,
    Sent: '',
    Message: '',
    UserInfo: null
  };

  @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;

  constructor(private activatedRoute: ActivatedRoute, private apiService: BellumgensApiService) {
    super();
    this.subs.push(this.activatedRoute.params.subscribe(params => this.application.TeamId = params['teamid']));
  }

  public submitApplication() {
    if (this.authUser) {
      this.application.ApplicantId = this.authUser.id;
      this.apiService.submitApplication(this.application).subscribe(_ => this.dialog.close());
    }
  }
}
