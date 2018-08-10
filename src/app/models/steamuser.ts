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
  availability: Availability [];
}

export interface CSGOStats {
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  favouriteWeapon: WeaponDescriptor;
}

export interface SteamUserWithStats {
  steamUser: SteamUser;
  userStats: CSGOStats;
}

export interface WeaponDescriptor {
  name: string;
  kills: number;
  accuracy: number;
}

export interface Availability {
  day: string;
  available: boolean;
  timeslot: Timeslot;
}

export interface Timeslot {
  from: Date;
  to: Date;
}

