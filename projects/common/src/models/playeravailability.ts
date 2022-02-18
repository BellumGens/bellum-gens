export interface Availability {
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
