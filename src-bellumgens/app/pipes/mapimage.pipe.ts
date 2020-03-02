import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty, CSGOMap } from '../../../src-common/models/csgomaps';

@Pipe({
  name: 'mapimage'
})
export class MapimagePipe implements PipeTransform {

  transform(map: CSGOMap): string {
    return ActiveDuty.find(m => m.id === map).image;
  }

}
