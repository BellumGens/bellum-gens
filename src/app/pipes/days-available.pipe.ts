import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from '../models/playeravailability';

@Pipe({
  name: 'daysAvailable'
})
export class DaysAvailablePipe implements PipeTransform {

  transform(available: Availability []): any {
    return available ? available.filter(a => a.Available) : available;
  }

}
