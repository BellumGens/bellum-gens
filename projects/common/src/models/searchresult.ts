import { CSGOTeam } from './csgoteam';
import { CSGODetails } from './csgoplayer';
import { CSGOStrategy } from './csgostrategy';
import { ApplicationUser } from './applicationuser';

export interface SearchResult {
  teams: CSGOTeam [];
  steamUser: CSGODetails;
  players: ApplicationUser [];
  strategies: CSGOStrategy [];
}
