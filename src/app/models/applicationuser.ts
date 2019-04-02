import { SteamUser } from './steamuser';
import { CSGOTeam } from './csgoteam';
import { UserNotification } from './usernotifications';
import { Availability } from './playeravailability';
import { PlaystyleRole } from './playerrole';
import { MapPool } from './csgomaps';

export interface ApplicationUser {
  SteamUser: SteamUser;
  Teams: CSGOTeam [];
  TeamAdmin: CSGOTeam [];
  Notifications: UserNotification [];
  Email: string;
  SearchVisible: boolean;
  Availability: Availability [];
  PreferredPrimaryRole: PlaystyleRole;
  PreferredSecondaryRole: PlaystyleRole;
  MapPool: MapPool [];
}

export interface UserPreferences {
  email: string;
  searchVisible: boolean;
  newEmail?: boolean;
}
