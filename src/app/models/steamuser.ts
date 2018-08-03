export interface SteamUser {
  steamID64: string;
  steamID: string;
  avatarIcon: string;
  avatarMedium: string;
  avatarFull: string;
  realname: string;
}

export interface CSGOStats {
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
}

export interface SteamUserWithStats {
  steamUser: SteamUser;
  userStats: CSGOStats;
}
