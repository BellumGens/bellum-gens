import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { IgxListComponent } from 'igniteui-angular';
import { UserNotification } from '../models/usernotifications';
import { BellumgensApiService } from '../services/bellumgens-api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input()
  public authUser: ApplicationUser;
  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public acceptInvitation(notification: UserNotification) {
    this.apiService.acceptInvite(notification).subscribe();
  }

  public rejectInvitation(notification: UserNotification) {
    this.apiService.rejectInvite(notification).subscribe();
  }

}
