import { Pipe, PipeTransform } from '@angular/core';
import { MapPool } from '../models/csgomaps';

@Pipe({
  name: 'ordermaps'
})
export class OrdermapsPipe implements PipeTransform {

  transform(mapPool: MapPool []): any {
    return mapPool.sort((x, y) => x.IsPlayed === y.IsPlayed ? 0 : x.IsPlayed < y.IsPlayed ? 1 : -1);
  }

}
