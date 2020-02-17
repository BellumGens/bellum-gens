import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { UnreadNotificationsPipe } from '../pipes/unread-notifications.pipe';
import { LoginService } from '../../../src-common/services/login.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  public authUser: ApplicationUser;

  @Output()
  public loaded = new EventEmitter<number>();

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(private authService: LoginService) {
    this.authService.applicationUser.subscribe(user => this.authUser = user);
  }

  public aggregate(args: any[]) {
    const unread = this.unreadPipe.transform(args);
    if (unread > 0) {
      this.loaded.emit(unread);
    }
  }

  public changed(args: number) {
    this.loaded.emit(args);
  }

}
