import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApplicationUser } from '../models/applicationuser';
import { IgxListComponent } from 'igniteui-angular';
import { UserNotification, NotificationState } from '../models/usernotifications';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input()
  public authUser: ApplicationUser;
  public loading = false;
  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public acceptInvitation(notification: UserNotification) {
    this.loading = true;
    this.apiService.acceptInvite(notification).pipe(finalize(() => this.loading = false)).subscribe(
      _ => notification.State = NotificationState.Accepted
    );
  }

  public rejectInvitation(notification: UserNotification) {
    this.loading = true;
    this.apiService.rejectInvite(notification).pipe(finalize(() => this.loading = false)).subscribe(
      _ => notification.State = NotificationState.Rejected
    );
  }

}
