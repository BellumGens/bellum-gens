import { PlaystyleRole } from './playerrole';
import { SteamGroup } from './steamuser';
import { NotificationState } from './usernotifications';

export interface CSGOTeam {
  teamId?: string;
  teamName: string;
  teamAvatar: string;
  description: string;
  discord?: string;
  visible: boolean;
  customUrl?: string;
  steamGroup?: SteamGroup;
}

export interface TeamMember {
  teamId: string;
  userId: string;
  steamId: string;
  isActive: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  role: PlaystyleRole;
  username: string;
  avatarIcon: string;
  avatarMedium: string;
  avatarFull: string;
  customUrl: string;
  country: string;
  realName: string;
}

export interface TeamApplication {
  State: NotificationState;
  ApplicantId: string;
  TeamId: string;
  Message: string;
  Sent: string;
  UserName?: string;
  AvatarIcon?: string;
}

export interface TeamSearch {
  role: PlaystyleRole;
  scheduleOverlap: number;
}

export const TEAM_PLACEHOLDER: CSGOTeam = {
  teamName: 'Create or view teams',
  teamAvatar: '',
  description: 'Use the left navigation to create your own team or to view existing teams.',
  visible: true,
};

export function getEmptyNewTeam(): CSGOTeam {
  return {
    teamName: '',
    teamAvatar: '',
    description: '',
    discord: '',
    visible: true,
    teamId: undefined
  };
}

export const TEAM_SEARCH: TeamSearch = {
  role: null,
  scheduleOverlap: 0
};
