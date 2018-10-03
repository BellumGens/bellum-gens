import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { IgxListComponent } from 'igniteui-angular';
import { UserNotification } from '../models/usernotifications';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public authUser: ApplicationUser;

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private authManager: LoginService) { }

  ngOnInit() {
    this.authManager.applicationUser.subscribe(
      user => {
        this.authUser = user;
        this.notifications.isLoading = false;
      }
    );
  }

  public acceptInvitation(notification: UserNotification) {
    console.log(notification);
  }

  public rejectInvitation(notification: UserNotification) {
    console.log(notification);
  }

}
