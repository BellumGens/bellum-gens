import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export interface UserNotification {
  State: NotificationState;
  TeamInfo: CSGOTeam;
  InvitingUser: ApplicationUser;
  Sent: string;
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
  ViewUser = 'viewuser'
}
