import { Pipe, PipeTransform } from '@angular/core';
import { CSGOMapPool, ActiveDuty } from '../../../src-common/models/csgomaps';

@Pipe({
  name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {
  private activeDuty = ActiveDuty;

  transform(maps: CSGOMapPool [], viewAll: boolean = true): CSGOMapPool [] {
    if (maps && !viewAll) {
      return maps.filter(m => this.activeDuty.find(a => a.id === m.Map).active);
    }
    return maps;
  }

}
