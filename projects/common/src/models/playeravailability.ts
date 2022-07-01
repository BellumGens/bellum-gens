export interface Availability {
  userId?: string;
  teamId?: string;
  day: DayOfWeek;
  available: boolean;
  from: Date;
  to: Date;
}

export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export const BASE_AVAILABILITY: Availability [] = [
  {
    day: DayOfWeek.Sunday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  },
  {
    day: DayOfWeek.Monday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  },
  {
    day: DayOfWeek.Tuesday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  },
  {
    day: DayOfWeek.Wednesday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  },
  {
    day: DayOfWeek.Thursday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  },
  {
    day: DayOfWeek.Friday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  },
  {
    day: DayOfWeek.Saturday,
    available: false,
    from: new Date('2018-01-15T00:00:00.000Z'),
    to: new Date('2018-01-15T00:00:00.000Z')
  }
];
