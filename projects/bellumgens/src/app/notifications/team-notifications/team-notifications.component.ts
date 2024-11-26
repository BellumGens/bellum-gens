import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamApplication, CSGOTeam, BellumgensApiService } from '../../../../../common/src/public_api';
import { NotificationStatePipe } from '../../pipes/notification-state.pipe';
import { SortApplicationsPipe } from '../../pipes/sort-applications.pipe';
import { DisabledNotificationsPipe } from '../../pipes/disabled-notifications.pipe';
import { RouterLink } from '@angular/router';
import { IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular';
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
  @Input() public team: CSGOTeam;

  @Output() public loaded = new EventEmitter<TeamApplication []>();

  @Output() public changed = new EventEmitter<number>();

  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  public applications: TeamApplication [];
  public pipeTrigger = 0;
  public actionInProgress = false;
  public actionText = '';

  constructor(private apiService: BellumgensApiService) { }

  public ngOnInit() {
    if (this.team) {
      this.apiService.teamApplications(this.team.teamId).subscribe(data => {
        this.applications = data;
        this.loaded.emit(data);
      });
    }
  }

  public approveApplication(application: TeamApplication) {
    this.actionText = 'Approving...';
    this.actionInProgress = true;
    this.apiService.approveApplication(application).subscribe({
      next: data => {
        application = data;
        this.pipeTrigger++;
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      complete: () => this.actionInProgress = false
    });
  }

  public rejectApplication(application: TeamApplication) {
    this.actionText = 'Rejecting...';
    this.actionInProgress = true;
    this.apiService.rejectApplication(application).subscribe({
      next: data => {
        application = data;
        this.pipeTrigger++;
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      complete: () => this.actionInProgress = false
    });
  }
}
