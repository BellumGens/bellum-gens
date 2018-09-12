import { PlaystyleRole } from './playerrole';
import { SteamUser } from './steamuser';

export interface CSGOTeam {
  TeamId: string;
  TeamName: string;
  TeamAvatar: string;
  Members: TeamMember [];
}

export interface TeamMember {
  UserId: string;
  IsActive: boolean;
  IsAdmin: boolean;
  Role: PlaystyleRole;
  SteamUser: SteamUser;
}
