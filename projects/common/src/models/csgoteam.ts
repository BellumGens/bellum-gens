import { PlaystyleRole } from './playerrole';
import { SteamGroup } from './steamuser';
import { NotificationState } from './usernotifications';
import { Game } from './tournament';

export interface CSGOTeam {
  teamId?: string;
  teamName: string;
  teamAvatar: string;
  description?: string;
  discord?: string;
  visible: boolean;
  customUrl?: string;
  steamGroup?: SteamGroup;
  /** The game the team plays (Counter-Strike or Dota 2). It is set when the team is created and does not change. */
  game?: Game;
}

/** The games teams are formed for. StarCraft II is played by single players. */
export const TEAM_GAMES = [Game.CSGO, Game.Dota2] as const;

/** The game of the team. Teams the API sends without one were created for Counter-Strike. */
export const teamGame = (team: CSGOTeam | null | undefined): Game => team?.game ?? Game.CSGO;

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
  state: NotificationState;
  applicantId: string;
  teamId: string;
  message: string;
  sent?: string;
  userName?: string;
  avatarIcon?: string;
}

export interface TeamSearch {
  role: PlaystyleRole | null;
  scheduleOverlap: number;
}

export const TEAM_PLACEHOLDER: CSGOTeam = {
  teamName: 'Create or view teams',
  teamAvatar: '',
  description: 'Use the left navigation to create your own team or to view existing teams.',
  visible: true
};

export const EMPTY_NEW_TEAM: CSGOTeam = {
  teamName: '',
  teamAvatar: '',
  discord: '',
  visible: true
};

export const TEAM_SEARCH: TeamSearch = {
  role: null,
  scheduleOverlap: 0
};
