import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty, CSGOMap } from '../../models/csgomaps';

@Pipe({
  name: 'csgomapimage'
})
export class CSGOMapimagePipe implements PipeTransform {

  public transform(map: CSGOMap): string {
    return ActiveDuty.find(m => m.id === map).image;
  }

}
