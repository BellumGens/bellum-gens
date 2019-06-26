import { Pipe, PipeTransform } from '@angular/core';
import { CSGOStrategy } from '../models/csgoteamstrategy';
import { MapPool } from '../models/csgomaps';

@Pipe({
  name: 'sidestrats'
})
export class SideStratsPipe implements PipeTransform {

  transform(strats: CSGOStrategy [], maps: MapPool []): CSGOStrategy [] {
    return strats && maps && strats.filter(s => maps.find(m => m.Map === s.Map).IsPlayed);
  }

}
