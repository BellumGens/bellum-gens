import { CSGOTeam } from './csgoteam';
import { CSGOPlayer } from './csgoplayer';
import { CSGOStrategy } from './csgostrategy';

export interface SearchResult {
  teams: CSGOTeam [];
  steamUser: CSGOPlayer;
  players: CSGOPlayer [];
  strategies: CSGOStrategy [];
}
