export interface Availability {
  Day: DayOfWeek;
  Available: boolean;
  From: Date;
  To: Date;
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
