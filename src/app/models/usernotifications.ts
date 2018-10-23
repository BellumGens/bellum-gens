import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';
import { SteamUser } from './steamuser';

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
