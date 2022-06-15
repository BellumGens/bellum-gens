import { Pipe, PipeTransform } from '@angular/core';
import { ACTIVE_DUTY, CSGOMap } from '../../models/csgomaps';

@Pipe({
  name: 'csgomapname'
})
export class CSGOMapnamePipe implements PipeTransform {

  public transform(map: CSGOMap): string {
    return map !== undefined ? ACTIVE_DUTY.find(m => m.id === map).map : '';
  }

}
