import { SteamUser } from './steamuser';
import { CSGOTeam } from './csgoteam';

export interface ApplicationUser {
  SteamUser: SteamUser;
  Teams: CSGOTeam [];
  TeamAdmin: CSGOTeam [];
}
