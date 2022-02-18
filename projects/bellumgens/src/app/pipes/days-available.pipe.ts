import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from '../../../../common/src/public_api';

@Pipe({
  name: 'daysAvailable'
})
export class DaysAvailablePipe implements PipeTransform {

  public transform(available: Availability []): Availability [] {
    return available ? available.filter(a => a.available) : available;
  }

}
