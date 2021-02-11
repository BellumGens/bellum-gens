import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty, CSGOMap } from '../../models/csgomaps';

@Pipe({
  name: 'csgomapname'
})
export class CSGOMapnamePipe implements PipeTransform {

  public transform(map: CSGOMap): string {
    return map !== undefined ? ActiveDuty.find(m => m.id === map).map : '';
  }

}
