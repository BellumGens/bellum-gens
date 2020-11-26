import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { UserNotification, NotificationState } from '../../../../src-common/models/usernotifications';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';

@Component({
  selector: 'app-player-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class PlayerNotificationsComponent {
  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  public pipeTrigger = 0;
  public actionInProgress = false;
  public actionText = '';

  @Input()
  public authUser: ApplicationUser;

  @Output()
  public loaded = new EventEmitter<UserNotification []>();

  @Output()
  public changed = new EventEmitter<number>();

  constructor(private apiService: BellumgensApiService, private router: Router) { }

  public acceptInvitation(notification: UserNotification) {
    this.actionText = 'Accepting...';
    this.actionInProgress = true;
    this.apiService.acceptInvite(notification).subscribe(
      _ => {
        notification.State = NotificationState.Accepted;
        this.pipeTrigger++;
        this.router.navigate(['team', notification.TeamInfo.customUrl]);
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      _ => this.actionInProgress = false
    );
  }

  public rejectInvitation(notification: UserNotification) {
    this.actionText = 'Rejecting...';
    this.actionInProgress = true;
    this.apiService.rejectInvite(notification).subscribe(
      _ => {
        notification.State = NotificationState.Rejected;
        this.pipeTrigger++;
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      _ => this.actionInProgress = false
    );
  }

}
