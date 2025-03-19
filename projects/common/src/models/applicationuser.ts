import { CSGODetails, CSGOStats } from "./csgoplayer";
import { SC2Details } from "./sc2player";
import { SteamUser } from "./steamuser";

export interface AdminAppUserSummary {
  id: string;
  avatarMedium: string;
  userName: string;
  roles: [];
}

export interface ApplicationUser {
  id: string;
  steamId: string;
  username: string;
  battleNetId: string;
  email: string;
  searchVisible: boolean;
  externalLogins: string [];
  steamUserException: boolean;
  userStatsException: boolean;
  registered: boolean;
  avatarUrl?: string;

  userStats?: CSGOStats;
  steamUser?: SteamUser;
  csgoDetails?: CSGODetails;
  sc2Details?: SC2Details;
}

export interface UserPreferences {
  email: string;
  searchVisible: boolean;
}
