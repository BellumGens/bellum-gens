import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty, CSGOMapPool } from '../../../src-common/models/csgomaps';

@Pipe({
  name: 'mapimage'
})
export class MapimagePipe implements PipeTransform {

  transform(map: CSGOMapPool): string {
    return ActiveDuty.find(m => m.id === map.Map).image;
  }

}
