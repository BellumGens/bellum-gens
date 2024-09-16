import { CSGOTeam } from './csgoteam';
import { CSGOStrategy } from './csgostrategy';
import { ApplicationUser } from './applicationuser';

export interface SearchResult {
  teams: CSGOTeam [];
  steamUser: ApplicationUser;
  players: ApplicationUser [];
  strategies: CSGOStrategy [];
}
