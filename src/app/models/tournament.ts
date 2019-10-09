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
}

export interface Company {
  Name: string;
  Website: string;
}

export enum Game {
  CSGO,
  StarCraft2
}

export function getEmptyNewApplication(): TournamentApplication {
  return {
    Game: null,
    Email: ''
  };
}

