import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from '../models/playeravailability';

@Pipe({
  name: 'profileAvaiabilityComplete'
})
export class ProfileAvailabilityCompletePipe implements PipeTransform {

  transform(availability: Availability [], css = false): string {
    if (availability && css) {
      return availability.filter(a => a.Available).length ? 'color-success' : 'color-error';
    } else if (availability) {
      return availability.filter(a => a.Available).length ? 'done' : 'error';
    }
    return null;
  }

}
