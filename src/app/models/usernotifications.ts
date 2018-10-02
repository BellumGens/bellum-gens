import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export interface UserNotification {
  State: InviteState;
  TeamInfo: CSGOTeam;
  InvitingUser: ApplicationUser;
  Sent: string;
}

export enum InviteState {
  NotSeen,
  Seen,
  Rejected,
  Accepted
}
