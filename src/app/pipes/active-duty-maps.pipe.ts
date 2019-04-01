import { Pipe, PipeTransform } from '@angular/core';
import { MapPool, ActiveDuty } from '../models/csgomaps';

@Pipe({
  name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {
  private activeDuty = ActiveDuty;

  transform(maps: MapPool [], onlyActiveDuty: boolean): MapPool [] {
    if (maps && onlyActiveDuty) {
      return maps.filter(m => this.activeDuty.find(a => a.id === m.Map).active);
    }
    return maps;
  }

}
