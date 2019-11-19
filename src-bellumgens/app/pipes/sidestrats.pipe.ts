import { Pipe, PipeTransform } from '@angular/core';
import { CSGOStrategy, VoteDirection } from '../models/csgostrategy';
import { MapPool } from '../models/csgomaps';
import { StratOrderBy } from '../models/misc';

@Pipe({
  name: 'sidestrats'
})
export class SideStratsPipe implements PipeTransform {

  transform(strats: CSGOStrategy [], maps: MapPool [], order: StratOrderBy): CSGOStrategy [] {
    let filtered = strats && maps && strats.filter(s => maps.find(m => m.Map === s.Map).IsPlayed);
    if (filtered && order === StratOrderBy.MostRecent) {
      filtered = filtered.sort((a, b) => a.LastUpdated === b.LastUpdated ? 0 : a.LastUpdated < b.LastUpdated ? 1 : -1);
    } else if (filtered && order === StratOrderBy.TopVoted) {
      filtered = filtered.sort((a, b) => {
        let av = 0, bv = 0;
        a.Votes.forEach(v => v.Vote === VoteDirection.Up ? av++ : av--);
        b.Votes.forEach(v => v.Vote === VoteDirection.Up ? bv++ : bv--);
        return av === bv ? 0 : av < bv ? 1 : -1;
      });
    }
    return filtered;
  }

}
