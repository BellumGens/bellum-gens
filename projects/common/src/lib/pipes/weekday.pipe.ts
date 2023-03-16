import { Pipe, PipeTransform } from '@angular/core';
import { DayOfWeek } from '../../models/playeravailability';

@Pipe({
    name: 'weekday',
    standalone: true
})
export class WeekdayPipe implements PipeTransform {
  private weekDays = [
    'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'
  ];

  public transform(day: DayOfWeek): string {
    return this.weekDays[day];
  }
}
