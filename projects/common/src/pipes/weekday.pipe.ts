import { Pipe, type PipeTransform } from '@angular/core';
import { type DayOfWeek } from 'bellum-gens-common/models';

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
