import { Pipe, PipeTransform } from '@angular/core';
import { CSGOStrategy, VoteDirection, CSGOMapPool, StratOrderBy } from 'bellum-gens-common/models';

@Pipe({
    name: 'sidestrats'
})
export class SideStratsPipe implements PipeTransform {

  public transform(strats: CSGOStrategy [] | null, maps: CSGOMapPool [] | null, order: StratOrderBy): CSGOStrategy [] | null {
    // A strategy for a map that is not in the pool is left out rather than failing the whole list
    let filtered = strats && maps && strats.filter(s => maps.find(m => m.mapId === s.map)?.isPlayed);
    if (filtered && order === StratOrderBy.MostRecent) {
      // The API sends ISO strings, so the dates are compared by their time rather than by reference
      const time = (strategy: CSGOStrategy) => strategy.lastUpdated ? new Date(strategy.lastUpdated).getTime() : NaN;
      filtered = filtered.sort((a, b) => time(b) - time(a));
    } else if (filtered && order === StratOrderBy.TopVoted) {
      filtered = filtered.sort((a, b) => {
        let av = 0; let bv = 0;
        if (a.votes) {
          a.votes.forEach(v => v.vote === VoteDirection.Up ? av++ : av--);
        }
        if (b.votes) {
          b.votes.forEach(v => v.vote === VoteDirection.Up ? bv++ : bv--);
        }
        return av === bv ? 0 : av < bv ? 1 : -1;
      });
    }
    return filtered;
  }

}
