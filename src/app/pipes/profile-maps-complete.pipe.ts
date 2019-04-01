import { Pipe, PipeTransform } from '@angular/core';
import { MapPool } from '../models/csgomaps';

@Pipe({
  name: 'profileMapsComplete'
})
export class ProfileMapsCompletePipe implements PipeTransform {

  transform(maps: MapPool [], css = false): string {
    if (css) {
      return maps.filter(m => m.IsPlayed).length ? 'color-success' : 'color-error';
    }
    return maps.filter(m => m.IsPlayed).length ? 'done' : 'error';
  }

}
