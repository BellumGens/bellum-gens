import { Pipe, PipeTransform } from '@angular/core';
import { CSGOStrategy, VoteDirection } from '../../../src-common/models/csgostrategy';
import { CSGOMapPool } from '../../../src-common/models/csgomaps';
import { StratOrderBy } from '../../../src-common/models/misc';

@Pipe({
  name: 'sidestrats'
})
export class SideStratsPipe implements PipeTransform {

  transform(strats: CSGOStrategy [], maps: CSGOMapPool [], order: StratOrderBy): CSGOStrategy [] {
    let filtered = strats && maps && strats.filter(s => maps.find(m => m.map === s.map).isPlayed);
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
