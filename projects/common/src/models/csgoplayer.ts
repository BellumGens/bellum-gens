import { SteamUser } from './steamuser';
import { PlaystyleRole } from './playerrole';

export interface CSGOStats {
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  private: boolean;
  favouriteWeapon: WeaponDescriptor | null;
  weapons: WeaponDescriptor [];
}

export interface CSGODetails {
  steamUser: SteamUser | null;
  userStats: CSGOStats | null;
  primaryRole?: PlaystyleRole;
  secondaryRole?: PlaystyleRole;
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  steamPrivate: boolean;
  realName: string;
  customUrl: string | null;
  avatarFull: string;
  avatarMedium: string;
  avatarIcon: string;
}

export interface WeaponDescriptor {
  name: string;
  kills: number;
  accuracy: number;
}

export interface PlayerSearch {
  role: PlaystyleRole | null;
  scheduleOverlap: number;
  teamId?: string;
}

export const PLAYER_SEARCH: PlayerSearch = {
  role: null,
  scheduleOverlap: 0
};
