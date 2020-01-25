import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export interface Tournament {
  ID?: string;
  Name: string;
  StartDate?: Date;
  EndDate?: Date;
}

export interface TournamentApplication {
  Id?: string;
  UserId?: string;
  CompanyId?: string;
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
  State: TournamentApplicationState;
  User: ApplicationUser;
  Team: CSGOTeam;
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
  return { Name: null };
}

export function getEmptyNewGroup(): TournamentGroup {
  return { Name: null, inEdit: false };
}

export const GAMES = [
  { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
  { name: 'StarCraft II', id: Game.StarCraft2 }
];
