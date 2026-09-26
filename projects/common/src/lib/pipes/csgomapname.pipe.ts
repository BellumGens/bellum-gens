import { Pipe, type PipeTransform } from '@angular/core';
import { ACTIVE_DUTY, type CSGOMap } from '../../models/csgomaps';

@Pipe({
    name: 'csgomapname'
})
export class CSGOMapnamePipe implements PipeTransform {

  public transform(map: CSGOMap): string {
    return ACTIVE_DUTY.find(m => m.mapId === map)?.map || '';
  }

}
