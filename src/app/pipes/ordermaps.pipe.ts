import { Pipe, PipeTransform } from '@angular/core';
import { CSGOMap, MapPool } from '../models/csgomaps';

@Pipe({
  name: 'ordermaps'
})
export class OrdermapsPipe implements PipeTransform {

  transform(mapPool: MapPool [], orderBy: string): any {
    return mapPool.sort((x, y) => x[orderBy] < y[orderBy] ? 1 : 0);
  }

}
