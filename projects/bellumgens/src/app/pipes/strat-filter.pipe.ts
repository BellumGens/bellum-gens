import { Pipe, PipeTransform } from '@angular/core';
import { ACTIVE_DUTY, CSGOActiveDutyMap, CSGOStrategy } from '../../../../common/src/public_api';

@Pipe({
    name: 'stratFilter'
})
export class StratFilterPipe implements PipeTransform {

  private maps: CSGOActiveDutyMap [] = ACTIVE_DUTY;

  public transform(strats: CSGOStrategy [] | null, viewAll: boolean = true): CSGOStrategy [] | null {
    if (strats && !viewAll) {
      return strats.filter(s => this.maps.find(m => m.mapId === s.map)?.active);
    }
    return strats;
  }

}
