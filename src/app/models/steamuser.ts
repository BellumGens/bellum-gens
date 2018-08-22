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
  favouriteWeapon: WeaponDescriptor;
}

export interface SteamUserWithStats {
  steamUser: SteamUser;
  steamUserException: string;
  userStats: CSGOStats;
  userStatsException: string;
  availability: Availability [];
  primaryRole: PlaystyleRole;
  secondaryRole: PlaystyleRole;
  roles: Role [];
}

export interface WeaponDescriptor {
  name: string;
  kills: number;
  accuracy: number;
}

export interface Availability {
  Day: DayOfWeek;
  Available: boolean;
  From: Date;
  To: Date;
}

export interface Role {
  Id: PlaystyleRole;
  Name: string;
}

export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export enum PlaystyleRole {
  IGL,
  Awper,
  EntryFragger,
  Support,
  Lurker
}

