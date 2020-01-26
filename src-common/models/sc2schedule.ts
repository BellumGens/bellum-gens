import { getEmptyNewMatch, MatchSchedule } from './tournament-schedule';


export const WEEKLY_SC2_SCHEDULE: MatchSchedule [] = [
  { name: 'Седмица 1', start: new Date(2020, 0, 27), end: new Date(2020, 0, 30),
    days: [
      {
        day: new Date(2020, 0, 27),
        slots: [
          { start: new Date(2020, 0, 27, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 27, 19, 30, 0)) },
          { start: new Date(2020, 0, 27, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 27, 20, 30, 0)) },
          { start: new Date(2020, 0, 27, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 27, 21, 30, 0)) },
          { start: new Date(2020, 0, 27, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 27, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 0, 28),
        slots: [
          { start: new Date(2020, 0, 28, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 28, 19, 30, 0)) },
          { start: new Date(2020, 0, 28, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 28, 20, 30, 0)) },
          { start: new Date(2020, 0, 28, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 28, 21, 30, 0)) },
          { start: new Date(2020, 0, 28, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 28, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 0, 29),
        slots: [
          { start: new Date(2020, 0, 29, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 29, 19, 30, 0)) },
          { start: new Date(2020, 0, 29, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 29, 20, 30, 0)) },
          { start: new Date(2020, 0, 29, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 29, 21, 30, 0)) },
          { start: new Date(2020, 0, 29, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 29, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 0, 30),
        slots: [
          { start: new Date(2020, 0, 30, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 30, 19, 30, 0)) },
          { start: new Date(2020, 0, 30, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 30, 20, 30, 0)) },
          { start: new Date(2020, 0, 30, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 30, 21, 30, 0)) },
          { start: new Date(2020, 0, 30, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 0, 30, 22, 30, 0)) }
        ]
      }
    ]
  },
  { name: 'Седмица 2', start: new Date(2020, 1, 3), end: new Date(2020, 1, 6),
    days: [
      {
        day: new Date(2020, 1, 3),
        slots: [
          { start: new Date(2020, 1, 3, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 3, 19, 30, 0)) },
          { start: new Date(2020, 1, 3, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 3, 20, 30, 0)) },
          { start: new Date(2020, 1, 3, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 3, 21, 30, 0)) },
          { start: new Date(2020, 1, 3, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 3, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 4),
        slots: [
          { start: new Date(2020, 1, 4, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 4, 19, 30, 0)) },
          { start: new Date(2020, 1, 4, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 4, 20, 30, 0)) },
          { start: new Date(2020, 1, 4, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 4, 21, 30, 0)) },
          { start: new Date(2020, 1, 4, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 4, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 5),
        slots: [
          { start: new Date(2020, 1, 5, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 5, 19, 30, 0)) },
          { start: new Date(2020, 1, 5, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 5, 20, 30, 0)) },
          { start: new Date(2020, 1, 5, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 5, 21, 30, 0)) },
          { start: new Date(2020, 1, 5, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 5, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 6),
        slots: [
          { start: new Date(2020, 1, 6, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 6, 19, 30, 0)) },
          { start: new Date(2020, 1, 6, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 6, 20, 30, 0)) },
          { start: new Date(2020, 1, 6, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 6, 21, 30, 0)) },
          { start: new Date(2020, 1, 6, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 6, 22, 30, 0)) }
        ]
      }
    ]
  },
  { name: 'Седмица 3', start: new Date(2020, 1, 10), end: new Date(2020, 1, 13),
    days: [
      {
        day: new Date(2020, 1, 10),
        slots: [
          { start: new Date(2020, 1, 10, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 10, 19, 30, 0)) },
          { start: new Date(2020, 1, 10, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 10, 20, 30, 0)) },
          { start: new Date(2020, 1, 10, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 10, 21, 30, 0)) },
          { start: new Date(2020, 1, 10, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 10, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 11),
        slots: [
          { start: new Date(2020, 1, 11, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 11, 19, 30, 0)) },
          { start: new Date(2020, 1, 11, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 11, 20, 30, 0)) },
          { start: new Date(2020, 1, 11, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 11, 21, 30, 0)) },
          { start: new Date(2020, 1, 11, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 11, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 12),
        slots: [
          { start: new Date(2020, 1, 12, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 12, 19, 30, 0)) },
          { start: new Date(2020, 1, 12, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 12, 20, 30, 0)) },
          { start: new Date(2020, 1, 12, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 12, 21, 30, 0)) },
          { start: new Date(2020, 1, 12, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 12, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 13),
        slots: [
          { start: new Date(2020, 1, 13, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 13, 19, 30, 0)) },
          { start: new Date(2020, 1, 13, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 13, 20, 30, 0)) },
          { start: new Date(2020, 1, 13, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 13, 21, 30, 0)) },
          { start: new Date(2020, 1, 13, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 13, 22, 30, 0)) }
        ]
      }
    ]
  },
  { name: 'Седмица 4', start: new Date(2020, 1, 17), end: new Date(2020, 1, 20),
    days: [
      {
        day: new Date(2020, 1, 17),
        slots: [
          { start: new Date(2020, 1, 17, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 17, 19, 30, 0)) },
          { start: new Date(2020, 1, 17, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 17, 20, 30, 0)) },
          { start: new Date(2020, 1, 17, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 17, 21, 30, 0)) },
          { start: new Date(2020, 1, 17, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 17, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 18),
        slots: [
          { start: new Date(2020, 1, 18, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 18, 19, 30, 0)) },
          { start: new Date(2020, 1, 18, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 18, 20, 30, 0)) },
          { start: new Date(2020, 1, 18, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 18, 21, 30, 0)) },
          { start: new Date(2020, 1, 18, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 18, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 19),
        slots: [
          { start: new Date(2020, 1, 19, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 19, 19, 30, 0)) },
          { start: new Date(2020, 1, 19, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 19, 20, 30, 0)) },
          { start: new Date(2020, 1, 19, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 19, 21, 30, 0)) },
          { start: new Date(2020, 1, 19, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 19, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 20),
        slots: [
          { start: new Date(2020, 1, 20, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 20, 19, 30, 0)) },
          { start: new Date(2020, 1, 20, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 20, 20, 30, 0)) },
          { start: new Date(2020, 1, 20, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 20, 21, 30, 0)) },
          { start: new Date(2020, 1, 20, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 20, 22, 30, 0)) }
        ]
      }
    ]
  },
  { name: 'Седмица 5', start: new Date(2020, 1, 24), end: new Date(2020, 1, 27),
    days: [
      {
        day: new Date(2020, 1, 24),
        slots: [
          { start: new Date(2020, 1, 24, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 24, 19, 30, 0)) },
          { start: new Date(2020, 1, 24, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 24, 20, 30, 0)) },
          { start: new Date(2020, 1, 24, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 24, 21, 30, 0)) },
          { start: new Date(2020, 1, 24, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 24, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 25),
        slots: [
          { start: new Date(2020, 1, 25, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 25, 19, 30, 0)) },
          { start: new Date(2020, 1, 25, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 25, 20, 30, 0)) },
          { start: new Date(2020, 1, 25, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 25, 21, 30, 0)) },
          { start: new Date(2020, 1, 25, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 25, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 26),
        slots: [
          { start: new Date(2020, 1, 26, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 26, 19, 30, 0)) },
          { start: new Date(2020, 1, 26, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 26, 20, 30, 0)) },
          { start: new Date(2020, 1, 26, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 26, 21, 30, 0)) },
          { start: new Date(2020, 1, 26, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 26, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 1, 27),
        slots: [
          { start: new Date(2020, 1, 27, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 27, 19, 30, 0)) },
          { start: new Date(2020, 1, 27, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 27, 20, 30, 0)) },
          { start: new Date(2020, 1, 27, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 27, 21, 30, 0)) },
          { start: new Date(2020, 1, 27, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 1, 27, 22, 30, 0)) }
        ]
      }
    ]
  },
  { name: 'Седмица 6', start: new Date(2020, 2, 2), end: new Date(2020, 2, 5),
    days: [
      {
        day: new Date(2020, 2, 2),
        slots: [
          { start: new Date(2020, 2, 2, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 2, 19, 30, 0)) },
          { start: new Date(2020, 2, 2, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 2, 20, 30, 0)) },
          { start: new Date(2020, 2, 2, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 2, 21, 30, 0)) },
          { start: new Date(2020, 2, 2, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 2, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 2, 3),
        slots: [
          { start: new Date(2020, 2, 3, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 3, 19, 30, 0)) },
          { start: new Date(2020, 2, 3, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 3, 20, 30, 0)) },
          { start: new Date(2020, 2, 3, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 3, 21, 30, 0)) },
          { start: new Date(2020, 2, 3, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 3, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 2, 4),
        slots: [
          { start: new Date(2020, 2, 4, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 4, 19, 30, 0)) },
          { start: new Date(2020, 2, 4, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 4, 20, 30, 0)) },
          { start: new Date(2020, 2, 4, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 4, 21, 30, 0)) },
          { start: new Date(2020, 2, 4, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 4, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 2, 5),
        slots: [
          { start: new Date(2020, 2, 5, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 5, 19, 30, 0)) },
          { start: new Date(2020, 2, 5, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 5, 20, 30, 0)) },
          { start: new Date(2020, 2, 5, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 5, 21, 30, 0)) },
          { start: new Date(2020, 2, 5, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 5, 22, 30, 0)) }
        ]
      }
    ]
  },
  { name: 'Седмица 7', start: new Date(2020, 2, 9), end: new Date(2020, 2, 12),
    days: [
      {
        day: new Date(2020, 2, 9),
        slots: [
          { start: new Date(2020, 2, 9, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 9, 19, 30, 0)) },
          { start: new Date(2020, 2, 9, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 9, 20, 30, 0)) },
          { start: new Date(2020, 2, 9, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 9, 21, 30, 0)) },
          { start: new Date(2020, 2, 9, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 9, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 2, 10),
        slots: [
          { start: new Date(2020, 2, 10, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 10, 19, 30, 0)) },
          { start: new Date(2020, 2, 10, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 10, 20, 30, 0)) },
          { start: new Date(2020, 2, 10, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 10, 21, 30, 0)) },
          { start: new Date(2020, 2, 10, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 10, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 2, 11),
        slots: [
          { start: new Date(2020, 2, 11, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 11, 19, 30, 0)) },
          { start: new Date(2020, 2, 11, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 11, 20, 30, 0)) },
          { start: new Date(2020, 2, 11, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 11, 21, 30, 0)) },
          { start: new Date(2020, 2, 11, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 11, 22, 30, 0)) }
        ]
      },
      {
        day: new Date(2020, 2, 12),
        slots: [
          { start: new Date(2020, 2, 12, 19, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 12, 19, 30, 0)) },
          { start: new Date(2020, 2, 12, 20, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 12, 20, 30, 0)) },
          { start: new Date(2020, 2, 12, 21, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 12, 21, 30, 0)) },
          { start: new Date(2020, 2, 12, 22, 30, 0), match: getEmptyNewMatch(new Date(2020, 2, 12, 22, 30, 0)) }
        ]
      }
    ]
  }
];
