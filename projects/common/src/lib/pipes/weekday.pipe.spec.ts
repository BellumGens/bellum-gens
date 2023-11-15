import { DayOfWeek } from '../../public_api';
import { WeekdayPipe } from './weekday.pipe';


describe('WeekdayPipe', () => {
  let pipe: WeekdayPipe;

  beforeEach(() => {
    pipe = new WeekdayPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms DayOfWeek.Sunday to "Sundays"', () => {
    expect(pipe.transform(DayOfWeek.Sunday)).toBe('Sundays');
  });

  it('transforms DayOfWeek.Monday to "Mondays"', () => {
    expect(pipe.transform(DayOfWeek.Monday)).toBe('Mondays');
  });

  it('transforms DayOfWeek.Tuesday to "Tuesdays"', () => {
    expect(pipe.transform(DayOfWeek.Tuesday)).toBe('Tuesdays');
  });

  it('transforms DayOfWeek.Wednesday to "Wednesdays"', () => {
    expect(pipe.transform(DayOfWeek.Wednesday)).toBe('Wednesdays');
  });

  it('transforms DayOfWeek.Thursday to "Thursdays"', () => {
    expect(pipe.transform(DayOfWeek.Thursday)).toBe('Thursdays');
  });

  it('transforms DayOfWeek.Friday to "Fridays"', () => {
    expect(pipe.transform(DayOfWeek.Friday)).toBe('Fridays');
  });

  it('transforms DayOfWeek.Saturday to "Saturdays"', () => {
    expect(pipe.transform(DayOfWeek.Saturday)).toBe('Saturdays');
  });
});
