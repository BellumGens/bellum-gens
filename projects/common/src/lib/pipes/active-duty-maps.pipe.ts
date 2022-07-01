import { Pipe, PipeTransform } from '@angular/core';
import { CSGOMapPool } from '../../public_api';

@Pipe({
  name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {

  public transform(maps: CSGOMapPool [], viewAll: boolean = true, _?: number): any [] {
    if (maps && !viewAll) {
      return maps.filter(m => m.active);
    }
    return maps;
  }

}
