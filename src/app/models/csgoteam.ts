import { PlaystyleRole } from './playerrole';
import { SteamUser } from './steamuser';
import { NotificationState } from './usernotifications';

export interface CSGOTeam {
  TeamId: string;
  TeamName: string;
  TeamAvatar: string;
  Members: TeamMember [];
}

export interface TeamMember {
  TeamId: string;
  UserId: string;
  IsActive: boolean;
  IsAdmin: boolean;
  Role: PlaystyleRole;
  SteamUser: SteamUser;
}

export interface TeamApplication {
  TeamId: string;
  ApplicantId: string;
  Message: string;
  State: NotificationState;
}
