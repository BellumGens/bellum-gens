import { CSGOTeam } from './csgoteam';
import { CSGOPlayer } from './csgoplayer';

export interface SearchResult {
  Teams: CSGOTeam [];
  Players: CSGOPlayer [];
}
