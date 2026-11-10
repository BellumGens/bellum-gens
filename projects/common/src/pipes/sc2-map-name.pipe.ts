import { Pipe, type PipeTransform } from '@angular/core';
import { type SC2Map, SC2_MAPS } from 'bellum-gens-common/models';

@Pipe({
    name: 'sc2MapName'
})
export class Sc2MapNamePipe implements PipeTransform {

  public transform(map: SC2Map | null | undefined): string {
    return SC2_MAPS.find(m => m.id === map)?.map || '';
  }

}
