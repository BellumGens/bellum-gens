import { Component, Signal, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LoginService,
  ApplicationUser,
  UserNotification,
  NotificationState,
  BellumgensApiService
} from '../../../../../common/src/public_api';
import { NotificationStatePipe } from '../../pipes/notification-state.pipe';
import { SortNotificationsPipe } from '../../pipes/sort-notifications.pipe';
import { DisabledNotificationsPipe } from '../../pipes/disabled-notifications.pipe';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-player-notifications',
  templateUrl: './player-notifications.component.html',
  styleUrls: ['./player-notifications.component.scss'],
  imports: [
    IGX_LIST_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    IgxButtonDirective,
    IgxRippleDirective,
    DatePipe,
    DisabledNotificationsPipe,
    SortNotificationsPipe,
    NotificationStatePipe
  ]
})
export class PlayerNotificationsComponent {
  private apiService = inject(BellumgensApiService);
  private authManager = inject(LoginService);
  private router = inject(Router);

  public loaded = output<UserNotification []>();

  public changed = output<number>();

  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  // Bumped after a notification's state changes, so the sort pipe and the
  // list re-render.
  public pipeTrigger = signal(0);
  public actionInProgress = signal(false);
  public actionText = signal('');

  public authUser: Signal<ApplicationUser> = this.authManager.applicationUser;
  // Only pull the notifications once a user is logged in.
  public notifications = computed<UserNotification []>(() => this.authUser() ? this.authManager.userNotifications() : null);

  public acceptInvitation(notification: UserNotification) {
    this.actionText.set('Accepting...');
    this.actionInProgress.set(true);
    this.apiService.acceptInvite(notification).subscribe({
      next: () => {
        // The notification belongs to the list cached by LoginService, so it is
        // updated in place to keep that cache in sync.
        notification.state = NotificationState.Accepted;
        this.pipeTrigger.update(v => v + 1);
        this.router.navigate(['team', notification.teamInfo.customUrl]);
        this.changed.emit(-1);
        this.actionInProgress.set(false);
      },
      complete: () => this.actionInProgress.set(false)
    });
  }

  public rejectInvitation(notification: UserNotification) {
    this.actionText.set('Rejecting...');
    this.actionInProgress.set(true);
    this.apiService.rejectInvite(notification).subscribe({
      next: () => {
        notification.state = NotificationState.Rejected;
        this.pipeTrigger.update(v => v + 1);
        this.changed.emit(-1);
        this.actionInProgress.set(false);
      },
      complete: () => this.actionInProgress.set(false)
    });
  }
}
