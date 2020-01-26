import { CSGOTeam } from './csgoteam';
import { AppUserSummary } from './applicationuser';

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
  match: TournamentCSGOMatch | TournamentSC2Match;
  inEdit?: boolean;
}

export interface TournamentMatch {
  Id?: string;
  DemoLink?: string;
  VideoLink?: string;
  StartTime?: Date;
  EndTime?: Date;
  GroupId?: string;
  Maps?: any [];
}

export interface TournamentCSGOMatch extends TournamentMatch {
  Team1Id?: string;
  Team2Id?: string;
  Team1?: CSGOTeam;
  Team2?: CSGOTeam;
}

export interface TournamentSC2Match extends TournamentMatch {
  Player1Id?: string;
  Player2Id?: string;
  Player1?: AppUserSummary;
  Player2?: AppUserSummary;
}

export function getEmptyNewMatch(start: Date): TournamentMatch {
  return { StartTime: start };
}
