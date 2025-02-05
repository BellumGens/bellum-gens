import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export const enum NotificationState {
  NotSeen,
  Seen,
  Rejected,
  Accepted
}

export const enum NotificationActions {
  Checkin = 'checkin',
  ViewTeam = 'viewteam',
  ViewUser = 'viewuser',
  ViewStrategy = 'viewstrategy'
}

export interface UserNotification {
  state: NotificationState;
  teamInfo: CSGOTeam;
  invitingUser: ApplicationUser;
  sent: string;
}

export interface PushNotificationWrapper {
  notification: PushNotification;
}

export interface PushNotification {
  title: string;
}
