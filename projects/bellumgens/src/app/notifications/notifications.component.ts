import { Component, Output, EventEmitter, inject } from '@angular/core';
import { UnreadNotificationsPipe } from '../pipes/unread-notifications.pipe';
import { LoginService, CSGOTeam } from '../../../../common/src/public_api';
import { Observable } from 'rxjs';
import { TeamNotificationsComponent } from './team-notifications/team-notifications.component';
import { AsyncPipe } from '@angular/common';
import { PlayerNotificationsComponent } from './player-notifications/player-notifications.component';

@Component({
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  imports: [
    PlayerNotificationsComponent,
    TeamNotificationsComponent,
    AsyncPipe
  ]
})
export class NotificationsComponent {
  private authService = inject(LoginService);

  @Output() public loaded = new EventEmitter<number>();

  public teamAdmin: Observable<CSGOTeam []>;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor() {
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
