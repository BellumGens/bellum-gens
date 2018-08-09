export class SteamUser {
  steamID64: string;
  steamID: string;
  avatarIcon: string;
  avatarMedium: string;
  avatarFull: string;
  realname: string;
  location: string;
  country: string;
  summary: string;
  customURL: string;
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
