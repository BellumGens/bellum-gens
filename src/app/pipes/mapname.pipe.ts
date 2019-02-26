import { Pipe, PipeTransform } from '@angular/core';
import { MapPool, ActiveDuty, CSGOMap } from '../models/csgomaps';

@Pipe({
  name: 'mapname'
})
export class MapnamePipe implements PipeTransform {

  transform(map: CSGOMap): string {
    return map !== undefined ? ActiveDuty.find(m => m.id === map).map : '';
  }

}
