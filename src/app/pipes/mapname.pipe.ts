import { Pipe, PipeTransform } from '@angular/core';
import { MapPool, ActiveDuty } from '../models/csgomaps';

@Pipe({
  name: 'mapname'
})
export class MapnamePipe implements PipeTransform {

  transform(map: MapPool): string {
    return ActiveDuty.find(m => m.id === map.Map).map;
  }

}
