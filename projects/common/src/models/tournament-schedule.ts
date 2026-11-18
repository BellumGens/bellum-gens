import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';
import { CSGOMap } from './csgomaps';
import { SC2Map } from './sc2maps';

export const enum SC2Race {
  Random,
  Protoss,
  Terran,
  Zerg
}

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
  demoLink?: string | null;
  videoLink?: string | null;
  startTime?: Date;
  noShow?: boolean;
  groupId?: string | null;
  inEdit?: boolean;
  tournamentId?: string;
}

export interface TournamentCSGOMatch extends TournamentMatch {
  team1Id?: string;
  team2Id?: string;
  team1Points?: number;
  team2Points?: number;
  /** Computed by the API from the points; the empty GUID when the match is tied or not played yet. */
  winnerTeamId?: string;
  team1?: CSGOTeam;
  team2?: CSGOTeam;
  maps?: TournamentCSGOMatchMap [];
}

export interface TournamentSC2Match extends TournamentMatch {
  player1Id?: string;
  player2Id?: string;
  player1Points?: number;
  player2Points?: number;
  player1Race?: SC2Race;
  player2Race?: SC2Race;
  player1?: ApplicationUser;
  player2?: ApplicationUser;
  maps?: TournamentSC2MatchMap [];
}

/** A Dota 2 series between two teams; the points are the games each team won. */
export interface TournamentDota2Match extends TournamentMatch {
  team1Id?: string;
  team2Id?: string;
  team1Points?: number;
  team2Points?: number;
  /** Computed by the API from the points; the empty GUID when the series is drawn or not played yet. */
  winnerTeamId?: string;
  team1?: CSGOTeam;
  team2?: CSGOTeam;
  games?: TournamentDota2MatchGame [];
}

/** A single game of a Dota 2 series. */
export interface TournamentDota2MatchGame {
  id?: string;
  dota2MatchId?: string;
  /** The position of the game in the series, starting at 1. */
  gameNumber: number;
  /** The id of the game on Steam, to find it in the Dota 2 client. */
  steamMatchId?: number | null;
  /** The team on the Radiant side; the other team played on the Dire side. */
  radiantTeamId?: string | null;
  winnerTeamId?: string | null;
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
