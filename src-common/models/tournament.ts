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
  Id?: string;
  UserId?: string;
  CompanyId?: string;
  TournamentId?: string;
  Game: Game;
  TeamId?: string;
  Email: string;
  BattleNetId?: string;
  Hash?: string;
  DateSubmitted?: Date;
  State?: TournamentApplicationState;
}

export interface TournamentRegistration {
  Id: string;
  UserId: string;
  TeamId: string;
  State: TournamentApplicationState;
  User: ApplicationUser;
  Team: CSGOTeam;
  Company: string;
  PlayerPoints: number;
  TeamPoints: number;
  Wins: number;
  Losses: number;
  OTWins: number;
  OTLosses: number;
  RoundDifference: Number;
  BattleTag: string;
  TournamentCSGOGroupId: string;
  TournamentSC2GroupId: string;
}

export interface TournamentGroup {
  Id?: string;
  Name: string;
  TournamentId?: string;
  Participants?: TournamentRegistration [];
  Matches?: any [];
  inEdit?: boolean;
}

export interface TournamentCSGOGroup extends TournamentGroup {
  Matches?: any [];
}

export interface TournamentSC2Group extends TournamentGroup {
  Matches?: any [];
}

export interface Company {
  Name: string;
  Website: string;
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

export function getEmptyNewApplication(): TournamentApplication {
  return {
    Game: null,
    Email: ''
  };
}

export function getEmptyNewTournament(): Tournament {
  return { name: null };
}

export function getEmptyNewGroup(): TournamentGroup {
  return { Name: null, inEdit: false };
}

export const GAMES = [
  { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
  { name: 'StarCraft II', id: Game.StarCraft2 }
];
