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
  id?: string;
  demoLink?: string;
  videoLink?: string;
  startTime?: Date;
  noShow?: boolean;
  groupId?: string;
  inEdit?: boolean;
  tournamentId?: string;
}

export interface TournamentCSGOMatch extends TournamentMatch {
  team1Id?: string;
  team2Id?: string;
  team1Points?: number;
  team2Points?: number;
  team1?: CSGOTeam;
  team2?: CSGOTeam;
  maps?: TournamentCSGOMatchMap [];
}

export interface TournamentSC2Match extends TournamentMatch {
  player1Id?: string;
  player2Id?: string;
  player1Points?: number;
  player2Points?: number;
  player1?: AppUserSummary;
  player2?: AppUserSummary;
  maps?: TournamentSC2MatchMap [];
}

export interface TournamentMatchMap {
  id?: string;
}

export interface TournamentCSGOMatchMap extends TournamentMatchMap {
  map?: CSGOMap;
  csgoMatchId?: string;
  teamPickId?: string;
  teamBanId?: string;
  team1Score?: number;
  team2Score?: number;
}

export interface TournamentSC2MatchMap extends TournamentMatchMap {
  map?: SC2Map;
  sc2MatchId?: string;
  playerPickId?: string;
  playerBanId?: string;
  winnerId?: string;
}
