import { Pipe, type PipeTransform } from '@angular/core';
import { type CSGOActiveDutyMap } from 'bellum-gens-common/models';

@Pipe({
    name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {

  public transform(maps: CSGOActiveDutyMap [] | null | undefined, viewAll: boolean = true, _?: number): CSGOActiveDutyMap [] {
    if (maps && !viewAll) {
      return maps.filter(m => m.active);
    } if (!maps) {
      return [];
    }
    return maps;
  }

}
