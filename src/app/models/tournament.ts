import { CSGOTeam } from './csgoteam';

export interface TournamentApplication {
  UserId?: string;
  CompanyId?: string;
  Game: Game;
  TeamId?: string;
  Team?: CSGOTeam;
  Email: string;
  BattleNetId?: string;
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

