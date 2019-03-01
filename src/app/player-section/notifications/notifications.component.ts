import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { IgxListComponent } from 'igniteui-angular';
import { UserNotification, NotificationState } from '../../models/usernotifications';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class PlayerNotificationsComponent {

  @Input()
  public authUser: ApplicationUser;
  public loading = false;
  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];

  @Output()
  public loaded = new EventEmitter<UserNotification []>();

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService,
              private router: Router) { }

  public acceptInvitation(notification: UserNotification) {
    this.loading = true;
    this.apiService.acceptInvite(notification).pipe(finalize(() => this.loading = false)).subscribe(
      _ => {
        notification.State = NotificationState.Accepted;
        this.router.navigate(['team', notification.TeamInfo.TeamId]);
      }
    );
  }

  public rejectInvitation(notification: UserNotification) {
    this.loading = true;
    this.apiService.rejectInvite(notification).pipe(finalize(() => this.loading = false)).subscribe(
      _ => notification.State = NotificationState.Rejected
    );
  }

}
