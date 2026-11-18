/** The Dota 2 profile of a Steam account, aggregated from its most recent public matches. */
export interface Dota2Profile {
  steamId: string;
  accountId: number;
  /** The player hid their match data in the Dota 2 client, so there are no stats. */
  matchHistoryPrivate: boolean;
  matches: number;
  wins: number;
  losses: number;
  abandons: number;
  winRate: number;
  kda: number;
  killDeathRatio: number;
  averageKills: number;
  averageDeaths: number;
  averageAssists: number;
  averageLastHits: number;
  averageGoldPerMinute: number;
  averageExperiencePerMinute: number;
  /** The most played heroes, most played first. */
  heroes: Dota2HeroStats [];
  /** The matches the stats were built from, newest first. */
  recentMatches: Dota2RecentMatch [];
}

export interface Dota2HeroStats {
  heroId: number;
  /** Null when the hero list could not be retrieved from Steam. */
  heroName: string | null;
  heroImageUrl: string | null;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface Dota2RecentMatch {
  matchId: number;
  startTime: string;
  /** The length of the match in seconds. */
  duration: number;
  gameMode: number;
  lobbyType: number;
  won: boolean;
  heroId: number;
  heroName: string | null;
  heroImageUrl: string | null;
  kills: number;
  deaths: number;
  assists: number;
  lastHits: number;
  denies: number;
  goldPerMinute: number;
  experiencePerMinute: number;
  level: number;
  abandoned: boolean;
}
