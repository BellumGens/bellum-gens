import { Component, ViewChild, Input } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';
import { ApplicationUser } from '../../models/applicationuser';
import { TeamApplication, CSGOTeam } from '../../models/csgoteam';
import { NotificationState } from '../../models/usernotifications';
import { BellumgensApiService } from '../../services/bellumgens-api.service';

@Component({
  selector: 'app-team-application',
  templateUrl: './team-application.component.html',
  styleUrls: ['./team-application.component.css']
})
export class TeamApplicationComponent {
  @Input()
  public authUser: ApplicationUser;

  @Input()
  public team: CSGOTeam;

  public application: TeamApplication = {
    TeamId: '',
    ApplicantId: '',
    State: NotificationState.NotSeen,
    Sent: '',
    Message: ''
  };

  @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;

  constructor(private apiService: BellumgensApiService) { }

  public submitApplication() {
    if (this.authUser) {
      this.application.ApplicantId = this.authUser.id;
      this.application.TeamId = this.team.TeamId;
      this.apiService.submitApplication(this.application).subscribe(_ => this.dialog.close());
    }
  }
}
