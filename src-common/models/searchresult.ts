import { CSGOTeam } from './csgoteam';
import { CSGOPlayer } from './csgoplayer';
import { CSGOStrategy } from './csgostrategy';

export interface SearchResult {
  Teams: CSGOTeam [];
  SteamUser: CSGOPlayer;
  Players: CSGOPlayer [];
  Strategies: CSGOStrategy [];
}
