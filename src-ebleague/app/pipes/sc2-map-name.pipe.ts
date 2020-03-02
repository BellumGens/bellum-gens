import { Pipe, PipeTransform } from '@angular/core';
import { SC2Map, SC2_MAPS } from '../../../src-common/models/sc2maps';

@Pipe({
  name: 'sc2MapName'
})
export class Sc2MapNamePipe implements PipeTransform {

  transform(map: SC2Map): string {
    return map !== undefined ? SC2_MAPS.find(m => m.id === map).map : '';
  }

}
