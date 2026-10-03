import { Component, computed, inject, output } from '@angular/core';
import { UnreadNotificationsPipe } from '../pipes/unread-notifications.pipe';
import { CSGOTeam, LoginService } from '../../../../common/src/public_api';
import { TeamNotificationsComponent } from './team-notifications/team-notifications.component';
import { PlayerNotificationsComponent } from './player-notifications/player-notifications.component';

@Component({
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  imports: [
    PlayerNotificationsComponent,
    TeamNotificationsComponent
  ]
})
export class NotificationsComponent {
  private authService = inject(LoginService);

  public loaded = output<number>();

  // Only pull the admin teams once a user is logged in.
  private authUser = this.authService.applicationUser;
  public teamAdmin = computed<CSGOTeam []>(() => this.authUser() ? this.authService.teamsAdmin() : undefined);

  private unreadPipe = new UnreadNotificationsPipe();

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
