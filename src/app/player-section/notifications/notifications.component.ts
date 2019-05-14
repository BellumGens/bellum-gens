import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { IgxListComponent } from 'igniteui-angular';
import { UserNotification, NotificationState } from '../../models/usernotifications';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class PlayerNotificationsComponent {

  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  public pipeTrigger = 0;

  @Input()
  public authUser: ApplicationUser;

  @Output()
  public loaded = new EventEmitter<UserNotification []>();

  @Output()
  public changed = new EventEmitter<number>();

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService,
              private router: Router) { }

  public acceptInvitation(notification: UserNotification, event: Event) {
    const button = (<HTMLButtonElement>event.target);
    button.textContent = 'Accepting';
    this.apiService.acceptInvite(notification).subscribe(
      _ => {
        notification.State = NotificationState.Accepted;
        this.pipeTrigger++;
        this.router.navigate(['team', notification.TeamInfo.TeamId]);
        this.changed.emit(-1);
      },
      _ => {
        button.textContent = 'Accept';
      }
    );
  }

  public rejectInvitation(notification: UserNotification, event: Event) {
    const button = (<HTMLButtonElement>event.target);
    button.textContent = 'Rejecting';
    this.apiService.rejectInvite(notification).subscribe(
      _ => {
        notification.State = NotificationState.Rejected;
        this.pipeTrigger++;
        this.changed.emit(-1);
      },
      _ => {
        button.textContent = 'Reject';
      }
    );
  }

}
