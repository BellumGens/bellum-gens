import { SteamUser } from './steamuser';
import { PlaystyleRole } from './playerrole';
import { ApplicationUser } from './applicationuser';

export interface CSGOStats {
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  private: boolean;
  favouriteWeapon: WeaponDescriptor;
  weapons: WeaponDescriptor [];
}

export interface CSGOPlayer extends ApplicationUser {
  steamUser: SteamUser;
  steamUserException: boolean;
  userStats: CSGOStats;
  userStatsException: boolean;
  registered: boolean;
  primaryRole?: PlaystyleRole;
  secondaryRole?: PlaystyleRole;
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  steamPrivate: boolean;
}

export interface WeaponDescriptor {
  name: string;
  kills: number;
  accuracy: number;
}

export interface PlayerSearch {
  role: PlaystyleRole;
  scheduleOverlap: number;
  teamId?: string;
}

export const PLAYER_SEARCH: PlayerSearch = {
  role: null,
  scheduleOverlap: 0
};
