import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export interface UserNotification {
  State: NotificationState;
  TeamInfo: CSGOTeam;
  InvitingUser: ApplicationUser;
  Sent: string;
}

export enum NotificationState {
  NotSeen,
  Seen,
  Rejected,
  Accepted
}
