import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoginService,
  ApplicationUser,
  UserNotification,
  NotificationState,
  BellumgensApiService
} from '../../../../../common/src/public_api';


@Component({
  selector: 'app-player-notifications',
  templateUrl: './player-notifications.component.html',
  styleUrls: ['./player-notifications.component.scss']
})
export class PlayerNotificationsComponent {
  @Output()
  public loaded = new EventEmitter<UserNotification []>();

  @Output()
  public changed = new EventEmitter<number>();

  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  public pipeTrigger = 0;
  public actionInProgress = false;
  public actionText = '';

  public authUser: ApplicationUser;
  public notifications: UserNotification [];

  constructor(private apiService: BellumgensApiService, private authManager: LoginService, private router: Router) {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.authUser = user;
        this.authManager.userNotifications.subscribe(data => this.notifications = data);
      }
    });
  }

  public acceptInvitation(notification: UserNotification) {
    this.actionText = 'Accepting...';
    this.actionInProgress = true;
    this.apiService.acceptInvite(notification).subscribe(
      () => {
        notification.state = NotificationState.Accepted;
        this.pipeTrigger++;
        this.router.navigate(['team', notification.teamInfo.customUrl]);
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      () => this.actionInProgress = false
    );
  }

  public rejectInvitation(notification: UserNotification) {
    this.actionText = 'Rejecting...';
    this.actionInProgress = true;
    this.apiService.rejectInvite(notification).subscribe(
      () => {
        notification.state = NotificationState.Rejected;
        this.pipeTrigger++;
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      () => this.actionInProgress = false
    );
  }

}