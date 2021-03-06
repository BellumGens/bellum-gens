import { Pipe, PipeTransform } from '@angular/core';
import { DayOfWeek } from '../../../src-common/models/playeravailability';

@Pipe({
  name: 'weekday'
})
export class WeekdayPipe implements PipeTransform {
  private weekDays = [
    'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'
  ];

  public transform(day: DayOfWeek): string {
    return this.weekDays[day];
  }
}
