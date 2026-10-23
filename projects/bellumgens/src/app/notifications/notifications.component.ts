import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { UnreadNotificationsPipe } from '../pipes/unread-notifications.pipe';
import { CSGOTeam, LoginService, NotificationState, TeamApplication } from '../../../../common/src/public_api';
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

  // Reports the total unread notifications in the view, so the app can update its badge.
  public unreadChanged = output<number>();

  // Only pull the admin teams once a user is logged in.
  private authUser = this.authService.applicationUser;
  public teamAdmin = computed<CSGOTeam []>(() => this.authUser() ? this.authService.teamsAdmin() : undefined);

  private unreadPipe = new UnreadNotificationsPipe();
  // Player notifications are updated in place in the LoginService cache, so they are recounted after each change.
  private playerChanges = signal(0);
  private playerUnread = computed(() => {
    this.playerChanges();
    return this.authUser() ? this.unreadPipe.transform(this.authService.userNotifications()) : 0;
  });
  // Team applications are loaded fresh by every team in the view; only the current user's teams are counted.
  private teamCounts = signal(new Map<string, number>());
  private teamUnread = computed(() => {
    const counts = this.teamCounts();
    return (this.teamAdmin() ?? []).reduce((total, team) => total + (counts.get(team.teamId) ?? 0), 0);
  });
  public unreadCount = computed(() => this.playerUnread() + this.teamUnread());

  constructor() {
    effect(() => this.unreadChanged.emit(this.unreadCount()));
  }

  public teamLoaded(teamId: string, applications: TeamApplication []) {
    const unread = applications ? applications.filter(a => a.state === NotificationState.NotSeen).length : 0;
    this.teamCounts.update(counts => new Map(counts).set(teamId, unread));
  }

  public teamChanged(teamId: string, delta: number) {
    this.teamCounts.update(counts => new Map(counts).set(teamId, (counts.get(teamId) ?? 0) + delta));
  }

  public playerChanged() {
    this.playerChanges.update(count => count + 1);
  }
}
