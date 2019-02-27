import { Availability } from './playeravailability';
import { SteamUser } from './steamuser';
import { CSGOTeam } from './csgoteam';
import { PlaystyleRole, Role } from './playerrole';
import { MapPool } from './csgomaps';

export interface CSGOStats {
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  favouriteWeapon: WeaponDescriptor;
}

export interface CSGOPlayer {
  steamUser: SteamUser;
  steamUserException: string;
  userStats: CSGOStats;
  userStatsException: string;
  registered: boolean;
  availability: Availability [];
  primaryRole: PlaystyleRole;
  secondaryRole: PlaystyleRole;
  roles: Role [];
  mapPool: MapPool [];
  teams: CSGOTeam [];
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
