import { Component, inject, input, viewChild } from '@angular/core';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import {
  ApplicationUser,
  TeamApplication, CSGOTeam,
  NotificationState,
  BellumgensApiService
} from '../../../../../common/src/public_api';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-application',
  templateUrl: './team-application.component.html',
  styleUrls: ['./team-application.component.scss'],
  imports: [
    IgxButtonDirective,
    IgxRippleDirective,
    IgxDialogComponent,
    IGX_INPUT_GROUP_DIRECTIVES,
    FormsModule,
    IgxIconComponent
  ]
})
export class TeamApplicationComponent {
  private apiService = inject(BellumgensApiService);

  public dialog = viewChild.required(IgxDialogComponent);

  public authUser = input<ApplicationUser>();

  public team = input<CSGOTeam>();

  public application: TeamApplication = {
    teamId: '',
    applicantId: '',
    state: NotificationState.NotSeen,
    message: ''
  };

  public submitApplication() {
    const authUser = this.authUser();
    if (authUser) {
      const application: TeamApplication = {
        ...this.application,
        applicantId: authUser.id,
        teamId: this.team().teamId
      };
      this.apiService.submitApplication(application).subscribe(() => this.dialog().close());
    }
  }
}
