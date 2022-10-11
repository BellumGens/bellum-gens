import { Pipe, PipeTransform } from '@angular/core';
import { AllCSGOMaps, CSGOMapPool, CSGOStrategy } from '../../../../common/src/public_api';

@Pipe({
  name: 'stratFilter'
})
export class StratFilterPipe implements PipeTransform {

  private maps: CSGOMapPool [] = AllCSGOMaps;

  public transform(strats: CSGOStrategy [], viewAll: boolean = true, _?: number): CSGOStrategy [] {
    if (strats && !viewAll) {
      return strats.filter(s => this.maps.find(m => m.mapId === s.map).active);
    }
    return strats;
  }

}
