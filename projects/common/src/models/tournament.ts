import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';
import { TournamentCSGOMatch, TournamentSC2Match } from './tournament-schedule';

export enum Game {
  CSGO,
  StarCraft2
}

export const enum TournamentApplicationState {
  Pending,
  Confirmed,
  Banned
}

export enum TournamentVisibility {
  Public = 'public',
  Private = 'private',
  InviteOnly = 'invite-only'
}

export enum TournamentStatus {
  Draft = 'draft',
  Open = 'open',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface Tournament {
  id?: string;
  name: string;
  description?: string;
  logo?: string;
  startDate?: Date;
  endDate?: Date;
  active?: boolean;
  game?: Game;
  visibility?: TournamentVisibility;
  status?: TournamentStatus;
  creatorId?: string;
  inviteCode?: string;
  maxParticipants?: number;
  prizePool?: string;
  csgoMatches?: TournamentCSGOMatch [];
  sc2Matches?: TournamentSC2Match [];
}

export interface TournamentApplication {
  id?: string;
  userId?: string;
  companyId?: string;
  tournamentId?: string;
  tournamentName?: string;
  game: Game;
  teamId?: string;
  email: string;
  battleNetId?: string;
  firstName?: string;
  lastName?: string;
  discord?: string;
  country?: string;
  hash?: string;
  dateSubmitted?: Date;
  state?: TournamentApplicationState;
}

export interface TournamentParticipant {
  id: string;
  userId: string;
  teamId?: string;
  tournamentCSGOGroupId?: string;
  tournamentSC2GroupId?: string;
  state: TournamentApplicationState;
  user?: ApplicationUser;
  team?: CSGOTeam;
  companyId: string;
  country?: string;
  playerPoints?: number;
  teamPoints?: number;
  wins?: number;
  losses?: number;
  oTWins?: number;
  oTLosses?: number;
  roundDifference?: number;
  battleTag?: string;
}

export interface TournamentGroup {
  id?: string;
  name: string;
  tournamentId?: string;
  participants?: TournamentParticipant [];
  matches?: any [];
  inEdit?: boolean;
}

export interface TournamentCSGOGroup extends TournamentGroup {
  matches?: any [];
}

export interface TournamentSC2Group extends TournamentGroup {
  matches?: any [];
}

export interface Company {
  name: string;
  website: string;
}

export interface RegistrationsCount {
  game: Game;
  count: number;
}

const toTime = (date?: Date | string): number | null => {
  if (!date) {
    return null;
  }
  const time = new Date(date).getTime();
  return isNaN(time) ? null : time;
};

/**
 * The tournament status, derived from the active flag and the dates for tournaments that come without one
 * (the API sends no status for its tournaments).
 * Active tournaments are in progress, inactive ones that haven't started yet are open and those that have ended are completed.
 * Returns null when the status can't be determined.
 */
export const getTournamentStatus = (tournament: Tournament, now = Date.now()): TournamentStatus | null => {
  if (!tournament) {
    return null;
  }
  if (tournament.status) {
    return tournament.status;
  }
  if (tournament.active) {
    return TournamentStatus.InProgress;
  }
  const start = toTime(tournament.startDate);
  const end = toTime(tournament.endDate);
  if (start !== null && start > now) {
    return TournamentStatus.Open;
  }
  if (end !== null ? end < now : start !== null) {
    return TournamentStatus.Completed;
  }
  return null;
};

/**
 * Whether the tournament starts in the future and is either a draft
 * or comes without a status and isn't active (the API's tournaments that haven't started yet).
 */
export const isUpcomingTournament = (tournament: Tournament, now = Date.now()): boolean => {
  const start = toTime(tournament?.startDate);
  if (start === null || start <= now) {
    return false;
  }
  return tournament.status ? tournament.status === TournamentStatus.Draft : !tournament.active;
};

export const EMPTY_NEW_APPLICATION: TournamentApplication = { game: null, email: '' };

export const EMPTY_NEW_TOURNAMENT: Tournament = {
  id: '',
  name: '',
  visibility: TournamentVisibility.Public,
  status: TournamentStatus.Draft
};

export const EMPTY_NEW_GROUP: TournamentGroup = { id: '', name: '', inEdit: false };

export const GAMES = [
  { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
  { name: 'StarCraft II', id: Game.StarCraft2 }
];
