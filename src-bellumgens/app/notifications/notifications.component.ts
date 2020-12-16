import { Component, Output, EventEmitter } from '@angular/core';
import { UnreadNotificationsPipe } from '../pipes/unread-notifications.pipe';
import { LoginService } from '../../../src-common/services/login.service';
import { Observable } from 'rxjs';
import { CSGOTeam } from '../../../src-common/models/csgoteam';

@Component({
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  @Output() public loaded = new EventEmitter<number>();

  public teamAdmin: Observable<CSGOTeam []>;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(private authService: LoginService) {
    this.authService.applicationUser.subscribe(user => {
      if (user) {
        this.teamAdmin = this.authService.teamsAdmin;
      }
    });
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
