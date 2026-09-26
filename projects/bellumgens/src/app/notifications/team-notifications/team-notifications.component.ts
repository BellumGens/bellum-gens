import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { TeamApplication, CSGOTeam, BellumgensApiService } from '../../../../../common/src/public_api';
import { NotificationStatePipe } from '../../pipes/notification-state.pipe';
import { SortApplicationsPipe } from '../../pipes/sort-applications.pipe';
import { DisabledNotificationsPipe } from '../../pipes/disabled-notifications.pipe';
import { RouterLink } from '@angular/router';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css'],
  imports: [
    IGX_LIST_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    IgxButtonDirective,
    IgxRippleDirective,
    DatePipe,
    DisabledNotificationsPipe,
    SortApplicationsPipe,
    NotificationStatePipe
  ]
})
export class TeamNotificationsComponent implements OnInit {
  private apiService = inject(BellumgensApiService);

  public team = input<CSGOTeam>();

  public loaded = output<TeamApplication []>();

  public changed = output<number>();

  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  public applications = signal<TeamApplication []>(null);
  public actionInProgress = signal(false);
  public actionText = signal('');

  public ngOnInit() {
    const team = this.team();
    if (team) {
      this.apiService.teamApplications(team.teamId).subscribe(data => {
        this.applications.set(data);
        this.loaded.emit(data);
      });
    }
  }

  public approveApplication(application: TeamApplication) {
    this.actionText.set('Approving...');
    this.actionInProgress.set(true);
    this.apiService.approveApplication(application).subscribe({
      next: data => {
        this.replaceApplication(application, data);
        this.changed.emit(-1);
        this.actionInProgress.set(false);
      },
      complete: () => this.actionInProgress.set(false)
    });
  }

  public rejectApplication(application: TeamApplication) {
    this.actionText.set('Rejecting...');
    this.actionInProgress.set(true);
    this.apiService.rejectApplication(application).subscribe({
      next: data => {
        this.replaceApplication(application, data);
        this.changed.emit(-1);
        this.actionInProgress.set(false);
      },
      complete: () => this.actionInProgress.set(false)
    });
  }

  private replaceApplication(application: TeamApplication, updated: TeamApplication) {
    this.applications.update(list => list.map(a => a === application ? { ...a, ...updated } : a));
  }
}
