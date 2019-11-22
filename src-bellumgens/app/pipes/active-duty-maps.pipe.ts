import { Pipe, PipeTransform } from '@angular/core';
import { MapPool, ActiveDuty } from '../../../src-common/models/csgomaps';

@Pipe({
  name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {
  private activeDuty = ActiveDuty;

  transform(maps: MapPool [], viewAll: boolean = true): MapPool [] {
    if (maps && !viewAll) {
      return maps.filter(m => this.activeDuty.find(a => a.id === m.Map).active);
    }
    return maps;
  }

}
