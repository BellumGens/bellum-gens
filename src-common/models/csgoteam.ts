import { PlaystyleRole } from './playerrole';
import { SteamGroup } from './steamuser';
import { NotificationState } from './usernotifications';
import { Availability } from './playeravailability';

export interface CSGOTeam {
  teamId?: string;
  teamName: string;
  teamAvatar: string;
  description: string;
  discord?: string;
  visible: boolean;
  customUrl?: string;
  members?: TeamMember [];
  practiceSchedule?: Availability [];
  steamGroup?: SteamGroup;
}

export interface TeamMember {
  TeamId: string;
  UserId: string;
  IsActive: boolean;
  IsAdmin: boolean;
  IsEditor: boolean;
  Role: PlaystyleRole;
  Username: string;
  AvatarIcon: string;
  AvatarMedium: string;
  AvatarFull: string;
  CustomUrl: string;
  Country: string;
  RealName: string;
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
    teamId: undefined,
    practiceSchedule: [],
    members: undefined
  };
}

export const TEAM_SEARCH: TeamSearch = {
  role: null,
  scheduleOverlap: 0
};
