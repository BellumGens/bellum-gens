import { CSGOTeam } from './csgoteam';
import { AppUserSummary } from './applicationuser';
import { CSGOMap } from './csgomaps';
import { SC2Map } from './sc2maps';

export interface MatchSchedule {
  name: string;
  start: Date;
  end: Date;
  days: MatchScheduleDay [];
}

export interface MatchScheduleDay {
  day: Date;
  slots: MatchScheduleSlot [];
}

export interface MatchScheduleSlot {
  start: Date;
  match: TournamentCSGOMatch & TournamentSC2Match;
  inEdit?: boolean;
}

export interface TournamentMatch {
  Id?: string;
  DemoLink?: string;
  VideoLink?: string;
  StartTime?: Date;
  EndTime?: Date;
  GroupId?: string;
  Maps?: TournamentCSGOMatchMap [] | TournamentSC2MatchMap [];
  inEdit?: boolean;
}

export interface TournamentCSGOMatch extends TournamentMatch {
  Team1Id?: string;
  Team2Id?: string;
  Team1Points?: number;
  Team2Points?: number;
  Team1?: CSGOTeam;
  Team2?: CSGOTeam;
}

export interface TournamentSC2Match extends TournamentMatch {
  Player1Id?: string;
  Player2Id?: string;
  Player1Points?: number;
  Player2Points?: number;
  Player1?: AppUserSummary;
  Player2?: AppUserSummary;
}

export interface TournamentCSGOMatchMap {
  Id?: string;
  Map?: CSGOMap;
  CSGOMatchId?: string;
  TeamPickId?: string;
  TeamBanId?: string;
  Team1Score?: number;
  Team2Score?: number;
}

export interface TournamentSC2MatchMap {
  Id?: string;
  Map?: SC2Map;
  SC2MatchId?: string;
  PlayerPickId?: string;
  PlayerBanId?: string;
  WinnerId?: string;
}

export function getEmptyNewMatch(start: Date): TournamentMatch {
  return { StartTime: start };
}

