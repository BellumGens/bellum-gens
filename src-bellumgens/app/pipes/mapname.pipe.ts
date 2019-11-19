import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty, CSGOMap } from '../models/csgomaps';

@Pipe({
  name: 'mapname'
})
export class MapnamePipe implements PipeTransform {

  transform(map: CSGOMap): string {
    return map !== undefined ? ActiveDuty.find(m => m.id === map).map : '';
  }

}
