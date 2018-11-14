import { PlaystyleRole } from './playerrole';
import { SteamUser } from './steamuser';
import { NotificationState } from './usernotifications';

export interface CSGOTeam {
  TeamId: string;
  TeamName: string;
  TeamAvatar: string;
  Description: string;
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
  State: NotificationState;
  ApplicantId: string;
  TeamId: string;
  Message: string;
  Sent: string;
  UserInfo: SteamUser;
}

export const TEAM_PLACEHOLDER: CSGOTeam = {
  TeamName: 'Create or view teams',
  TeamAvatar: '',
  Description: 'Use the left navigation to create your own team or to view existing teams.',
  TeamId: undefined,
  Members: undefined
};
