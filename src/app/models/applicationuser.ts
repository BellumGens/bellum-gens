import { SteamUser } from './steamuser';
import { CSGOTeam } from './csgoteam';
import { UserNotification } from './usernotifications';
import { Availability } from './playeravailability';
import { PlaystyleRole } from './playerrole';
import { MapPool } from './csgomaps';

export interface ApplicationUser {
  id: string;
  steamUser: SteamUser;
  teams: CSGOTeam [];
  teamAdmin: CSGOTeam [];
  notifications: UserNotification [];
  email: string;
  searchVisible: boolean;
  availability: Availability [];
  primaryRole: PlaystyleRole;
  secondaryRole: PlaystyleRole;
  mapPool: MapPool [];
  externalLogins: string [];
}

export interface UserPreferences {
  email: string;
  searchVisible: boolean;
  newEmail?: boolean;
}
