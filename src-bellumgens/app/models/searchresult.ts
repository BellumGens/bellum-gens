import { CSGOTeam } from './csgoteam';
import { CSGOPlayer } from './csgoplayer';
import { CSGOStrategy } from './csgostrategy';
import { ApplicationUser } from './applicationuser';

export interface SearchResult {
  Teams: CSGOTeam [];
  SteamUser: CSGOPlayer;
  Players: ApplicationUser [];
  Strategies: CSGOStrategy [];
}
