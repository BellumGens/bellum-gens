import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

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

export enum NotificationState {
  NotSeen,
  Seen,
  Rejected,
  Accepted
}

export enum NotificationActions {
  ViewTeam = 'viewteam',
  ViewUser = 'viewuser',
  ViewStrategy = 'viewstrategy'
}
