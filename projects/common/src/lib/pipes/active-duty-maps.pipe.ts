import { Pipe, PipeTransform } from '@angular/core';
import { CSGOMapPool } from '../../public_api';

@Pipe({
    name: 'activeDutyMaps',
    standalone: true
})
export class ActiveDutyMapsPipe implements PipeTransform {

  public transform(maps: CSGOMapPool [], viewAll: boolean = true, _?: number): CSGOMapPool [] {
    if (maps && !viewAll) {
      return maps.filter(m => m.active);
    } if (!maps) {
      return [];
    }
    return maps;
  }

}
