import { PlaystyleRole } from './playerrole';
import { SteamUser } from './steamuser';
import { NotificationState } from './usernotifications';
import { Availability } from './playeravailability';

export interface CSGOTeam {
  TeamId: string;
  TeamName: string;
  TeamAvatar: string;
  Description: string;
  Members: TeamMember [];
  PracticeSchedule: Availability [];
}

export interface TeamMember {
  TeamId: string;
  UserId: string;
  IsActive: boolean;
  IsAdmin: boolean;
  IsEditor: boolean;
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

export interface TeamSearch {
  role: PlaystyleRole;
  scheduleOverlap: number;
}

export const TEAM_PLACEHOLDER: CSGOTeam = {
  TeamName: 'Create or view teams',
  TeamAvatar: '',
  Description: 'Use the left navigation to create your own team or to view existing teams.',
  TeamId: undefined,
  PracticeSchedule: [],
  Members: undefined
};

export const TEAM_SEARCH: TeamSearch = {
  role: null,
  scheduleOverlap: 0
};
