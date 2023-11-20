import { Pipe, PipeTransform } from '@angular/core';
import { SC2Map, SC2_MAPS } from '../../models/sc2maps';

@Pipe({
    name: 'sc2MapName',
    standalone: true
})
export class Sc2MapNamePipe implements PipeTransform {

  public transform(map: SC2Map): string {
    return SC2_MAPS.find(m => m.id === map)?.map || '';
  }

}
