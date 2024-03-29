import { Pipe, PipeTransform } from '@angular/core';
import { CSGOStrategy, VoteDirection, CSGOMapPool, StratOrderBy } from '../../../../common/src/public_api';

@Pipe({
    name: 'sidestrats',
    standalone: true
})
export class SideStratsPipe implements PipeTransform {

  public transform(strats: CSGOStrategy [], maps: CSGOMapPool [], order: StratOrderBy): CSGOStrategy [] {
    let filtered = strats && maps && strats.filter(s => maps.find(m => m.mapId === s.map).isPlayed);
    if (filtered && order === StratOrderBy.MostRecent) {
      filtered = filtered.sort((a, b) => a.lastUpdated === b.lastUpdated ? 0 : a.lastUpdated < b.lastUpdated ? 1 : -1);
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
