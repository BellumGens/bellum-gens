import { CSGOTeam } from './csgoteam';

export interface TournamentApplication {
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

export interface Company {
  Name: string;
  Website: string;
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
