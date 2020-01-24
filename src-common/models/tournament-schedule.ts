import { TournamentCSGOMatch } from './tournament';

export interface CSGOMatchSchedule {
  name: string;
  start: Date;
  end: Date;
  days: CSGOMatchScheduleDay [];
}

export interface CSGOMatchScheduleDay {
  day: Date;
  slots: CSGOMatchScheduleSlot [];
}

export interface CSGOMatchScheduleSlot {
  start: Date;
  match: TournamentCSGOMatch;
  inEdit?: boolean;
}

export const WEEKLY_CSGO_SCHEDULE: CSGOMatchSchedule [] = [
  { name: 'Седмица 1', start: new Date(2020, 0, 27), end: new Date(2020, 0, 30),
    days: [
      {
        day: new Date(2020, 0, 27),
        slots: [
          { start: new Date(2020, 0, 27, 19, 30, 0), match: null },
          { start: new Date(2020, 0, 27, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 0, 28),
        slots: [
          { start: new Date(2020, 0, 28, 19, 30, 0), match: null },
          { start: new Date(2020, 0, 28, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 0, 29),
        slots: [
          { start: new Date(2020, 0, 29, 19, 30, 0), match: null },
          { start: new Date(2020, 0, 29, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 0, 30),
        slots: [
          { start: new Date(2020, 0, 30, 19, 30, 0), match: null },
          { start: new Date(2020, 0, 30, 21, 30, 0), match: null }
        ]
      }
    ]
  },
  { name: 'Седмица 2', start: new Date(2020, 1, 3), end: new Date(2020, 1, 6),
    days: [
      {
        day: new Date(2020, 1, 3),
        slots: [
          { start: new Date(2020, 1, 3, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 3, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 1, 4),
        slots: [
          { start: new Date(2020, 1, 4, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 4, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 5),
        slots: [
          { start: new Date(2020, 1, 5, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 5, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 6),
        slots: [
          { start: new Date(2020, 1, 6, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 6, 21, 30, 0), match: null }
        ]
      }
    ]
  },
  { name: 'Седмица 3', start: new Date(2020, 1, 10), end: new Date(2020, 1, 13),
    days: [
      {
        day: new Date(2020, 1, 10),
        slots: [
          { start: new Date(2020, 1, 10, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 10, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 1, 11),
        slots: [
          { start: new Date(2020, 1, 11, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 11, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 12),
        slots: [
          { start: new Date(2020, 1, 12, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 12, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 13),
        slots: [
          { start: new Date(2020, 1, 13, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 13, 21, 30, 0), match: null }
        ]
      }
    ]
  },
  { name: 'Седмица 4', start: new Date(2020, 1, 17), end: new Date(2020, 1, 20),
    days: [
      {
        day: new Date(2020, 1, 17),
        slots: [
          { start: new Date(2020, 1, 17, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 17, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 1, 18),
        slots: [
          { start: new Date(2020, 1, 18, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 18, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 19),
        slots: [
          { start: new Date(2020, 1, 19, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 19, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 20),
        slots: [
          { start: new Date(2020, 1, 20, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 20, 21, 30, 0), match: null }
        ]
      }
    ]
  },
  { name: 'Седмица 5', start: new Date(2020, 1, 24), end: new Date(2020, 1, 27),
    days: [
      {
        day: new Date(2020, 1, 24),
        slots: [
          { start: new Date(2020, 1, 24, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 24, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 1, 25),
        slots: [
          { start: new Date(2020, 1, 25, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 25, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 26),
        slots: [
          { start: new Date(2020, 1, 26, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 26, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 1, 27),
        slots: [
          { start: new Date(2020, 1, 27, 19, 30, 0), match: null },
          { start: new Date(2020, 1, 27, 21, 30, 0), match: null }
        ]
      }
    ]
  },
  { name: 'Седмица 6', start: new Date(2020, 2, 2), end: new Date(2020, 2, 5),
    days: [
      {
        day: new Date(2020, 2, 2),
        slots: [
          { start: new Date(2020, 2, 2, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 2, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 2, 3),
        slots: [
          { start: new Date(2020, 2, 3, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 3, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 2, 4),
        slots: [
          { start: new Date(2020, 2, 4, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 4, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 2, 5),
        slots: [
          { start: new Date(2020, 2, 5, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 5, 21, 30, 0), match: null }
        ]
      }
    ]
  },
  { name: 'Седмица 7', start: new Date(2020, 2, 9), end: new Date(2020, 2, 12),
    days: [
      {
        day: new Date(2020, 2, 9),
        slots: [
          { start: new Date(2020, 2, 9, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 9, 21, 30, 0), match: null },
        ]
      },
      {
        day: new Date(2020, 2, 10),
        slots: [
          { start: new Date(2020, 2, 10, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 10, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 2, 11),
        slots: [
          { start: new Date(2020, 2, 11, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 11, 21, 30, 0), match: null }
        ]
      },
      {
        day: new Date(2020, 2, 12),
        slots: [
          { start: new Date(2020, 2, 12, 19, 30, 0), match: null },
          { start: new Date(2020, 2, 12, 21, 30, 0), match: null }
        ]
      }
    ]
  }
];
