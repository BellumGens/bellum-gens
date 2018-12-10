import { Pipe, PipeTransform } from '@angular/core';
import { TeamStrategy, Side } from '../models/csgoteamstrategy';
import { MapPool } from '../models/csgomaps';

@Pipe({
  name: 'sidestrats'
})
export class SideStratsPipe implements PipeTransform {

  transform(strats: TeamStrategy [], maps: MapPool []): any {
    return strats && maps && strats.filter(s => maps.find(m => m.Map === s.Map).IsPlayed);
  }

}
