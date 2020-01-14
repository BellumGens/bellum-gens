import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';

export interface Tournament {
  ID: string;
  Name: string;
  StartDate: Date;
  EndDate: Date;
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

export interface TournamentCSGORegistration {
  UserId: string;
  Team: CSGOTeam;
  State: TournamentApplicationState;
}

export interface TournamentSC2Registration {
  UserId: string;
  BattleTag: string;
  User: ApplicationUser;
  State: TournamentApplicationState;
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

export const GAMES = [
  { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
  { name: 'StarCraft II', id: Game.StarCraft2 }
];
