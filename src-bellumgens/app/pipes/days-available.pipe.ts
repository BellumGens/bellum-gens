import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from '../../../src-common/models/playeravailability';

@Pipe({
  name: 'daysAvailable'
})
export class DaysAvailablePipe implements PipeTransform {

  public transform(available: Availability []): Availability [] {
    return available ? available.filter(a => a.available) : available;
  }

}
