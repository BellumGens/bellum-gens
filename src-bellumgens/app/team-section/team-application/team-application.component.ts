import { Component, ViewChild, Input } from '@angular/core';
import { IgxDialogComponent } from '@infragistics/igniteui-angular';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { TeamApplication, CSGOTeam } from '../../../../src-common/models/csgoteam';
import { NotificationState } from '../../../../src-common/models/usernotifications';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';

@Component({
  selector: 'app-team-application',
  templateUrl: './team-application.component.html',
  styleUrls: ['./team-application.component.css']
})
export class TeamApplicationComponent {
  @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;

  @Input()
  public authUser: ApplicationUser;

  @Input()
  public team: CSGOTeam;

  public application: TeamApplication = {
    teamId: '',
    applicantId: '',
    state: NotificationState.NotSeen,
    message: ''
  };

  constructor(private apiService: BellumgensApiService) { }

  public submitApplication() {
    if (this.authUser) {
      this.application.applicantId = this.authUser.id;
      this.application.teamId = this.team.teamId;
      this.apiService.submitApplication(this.application).subscribe(_ => this.dialog.close());
    }
  }
}
