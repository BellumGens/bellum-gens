import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export interface UserNotification {
  State: NotificationState;
  TeamInfo: CSGOTeam;
  InvitingUser: ApplicationUser;
  Sent: string;
}

export interface TeamApplication {
  State: NotificationState;
  ApplicantId: string;
  TeamId: string;
  Message: string;
}

export enum NotificationState {
  NotSeen,
  Seen,
  Rejected,
  Accepted
}
