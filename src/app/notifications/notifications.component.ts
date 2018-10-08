import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { IgxListComponent, IgxToastComponent } from 'igniteui-angular';
import { UserNotification } from '../models/usernotifications';
import { BellumgensApiService } from '../services/bellumgens-api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public authUser: ApplicationUser;
  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;
  @ViewChild('error') public error: IgxToastComponent;
  @ViewChild('saveSuccess') public success: IgxToastComponent;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService) { }

  ngOnInit() {
    this.authManager.applicationUser.subscribe(
      user => {
        this.authUser = user;
        this.notifications.isLoading = false;
      }
    );
  }

  public acceptInvitation(notification: UserNotification) {
    this.apiService.acceptInvite(notification).subscribe(
      data => {
        this.success.message = 'Invite accepted...';
        this.success.show();
      },
      error => {
        this.error.message = error.error.Message;
        this.error.show();
      }
    );
  }

  public rejectInvitation(notification: UserNotification) {
    this.apiService.rejectInvite(notification).subscribe(
      data => {
        this.success.message = 'Invite rejected...';
        this.success.show();
      },
      error => {
        this.error.message = error.error.Message;
        this.error.show();
      }
    );
  }

}
