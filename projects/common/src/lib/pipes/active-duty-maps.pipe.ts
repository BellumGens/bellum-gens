import { Pipe, PipeTransform } from '@angular/core';
import { CSGOActiveDutyMap } from '../../public_api';

@Pipe({
    name: 'activeDutyMaps',
    standalone: true
})
export class ActiveDutyMapsPipe implements PipeTransform {

  public transform(maps: CSGOActiveDutyMap [], viewAll: boolean = true, _?: number): CSGOActiveDutyMap [] {
    if (maps && !viewAll) {
      return maps.filter(m => m.active);
    } if (!maps) {
      return [];
    }
    return maps;
  }

}
