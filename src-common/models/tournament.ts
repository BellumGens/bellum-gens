import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';
import { TournamentCSGOMatch } from './tournament-schedule';

export interface Tournament {
  id?: string;
  name: string;
  description?: string;
  logo?: string;
  startDate?: Date;
  endDate?: Date;
  active?: boolean;
  csgoMatches?: TournamentCSGOMatch [];
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
  hash?: string;
  dateSubmitted?: Date;
  state?: TournamentApplicationState;
}

export interface TournamentParticipant {
  id: string;
  userId: string;
  teamId: string;
  state: TournamentApplicationState;
  user: ApplicationUser;
  team: CSGOTeam;
  companyId: string;
  playerPoints: number;
  teamPoints: number;
  wins: number;
  losses: number;
  oTWins: number;
  oTLosses: number;
  roundDifference: number;
  battleTag: string;
  tournamentCSGOGroupId: string;
  tournamentSC2GroupId: string;
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

export enum Game {
  CSGO,
  StarCraft2
}

export enum TournamentApplicationState {
  Pending,
  Confirmed
}

export const EMPTY_NEW_APPLICATION: TournamentApplication = { game: null, email: '' };

export const EMPTY_NEW_TOURNAMENT: Tournament = { name: null };

export const EMPTY_NEW_GROUP: TournamentGroup = { name: null, inEdit: false };

export const GAMES = [
  { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
  { name: 'StarCraft II', id: Game.StarCraft2 }
];
