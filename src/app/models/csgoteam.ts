import { PlaystyleRole } from './playerrole';

export interface CSGOTeam {
  TeamId: string;
  TeamName: string;
  TeamAvatar: string;
  Members: TeamMember [];
}

export interface TeamMember {
  UserId: string;
  IsActive: string;
  IsAdmin: string;
  Role: PlaystyleRole;
}
