import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { IgxListComponent } from 'igniteui-angular';
import { UserNotification, NotificationState } from '../../models/usernotifications';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { Router } from '@angular/router';
import { noop } from 'rxjs';

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

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService,
              private router: Router) { }

  public acceptInvitation(notification: UserNotification) {
    this.actionText = 'Accepting...';
    this.actionInProgress = true;
    this.apiService.acceptInvite(notification).subscribe(
      _ => {
        notification.State = NotificationState.Accepted;
        this.pipeTrigger++;
        this.router.navigate(['team', notification.TeamInfo.CustomUrl]);
        this.changed.emit(-1);
      },
      _ => noop,
      () => this.actionInProgress = false
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
      },
      _ => noop,
      () => this.actionInProgress = false
    );
  }

}
