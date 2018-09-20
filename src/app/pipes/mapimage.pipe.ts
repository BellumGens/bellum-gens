import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty, MapPool } from '../models/csgomaps';

@Pipe({
  name: 'mapimage'
})
export class MapimagePipe implements PipeTransform {

  transform(map: MapPool): string {
    return ActiveDuty.find(m => m.id === map.Map).image;
  }

}
