import { CSGOTeam } from './csgoteam';
import { UserNotification } from './usernotifications';
import { Availability } from './playeravailability';
import { PlaystyleRole } from './playerrole';
import { CSGOMapPool } from './csgomaps';

export interface AdminAppUserSummary {
  Id: string;
  AvatarMedium: string;
  UserName: string;
  Roles: [];
}

export interface AppUserSummary {
  id: string;
  username: string;
  avatarMedium: string;
  customURL: string;
  battleNetId: string;
}

export interface ApplicationUser extends AppUserSummary {
  avatarIcon: string;
  avatarFull: string;
  realname: string;
  steamPrivate: boolean;
  headshotPercentage: number;
  killDeathRatio: number;
  accuracy: number;
  teams: CSGOTeam [];
  teamAdmin: CSGOTeam [];
  notifications: UserNotification [];
  email: string;
  searchVisible: boolean;
  availability: Availability [];
  primaryRole: PlaystyleRole;
  secondaryRole: PlaystyleRole;
  mapPool: CSGOMapPool [];
  externalLogins: string [];
  Roles: string [];
}

export interface UserPreferences {
  email: string;
  searchVisible: boolean;
  newEmail?: boolean;
}
