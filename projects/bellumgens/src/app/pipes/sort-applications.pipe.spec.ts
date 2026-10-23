import { SortApplicationsPipe } from './sort-applications.pipe';
import { NotificationState, TeamApplication } from '../../../../common/src/public_api';

const application = (applicantId: string, state: NotificationState): TeamApplication =>
  ({ applicantId, teamId: 'team-1', message: '', state });

describe('SortApplicationsPipe', () => {
  const pipe = new SortApplicationsPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a falsy input as is', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should sort the applications by state', () => {
    const applications = [
      application('a', NotificationState.NotSeen),
      application('b', NotificationState.Accepted),
      application('c', NotificationState.Seen),
      application('d', NotificationState.NotSeen),
      application('e', NotificationState.Rejected)
    ];

    expect(pipe.transform(applications).map(a => a.state)).toEqual([
      NotificationState.NotSeen,
      NotificationState.NotSeen,
      NotificationState.Seen,
      NotificationState.Rejected,
      NotificationState.Accepted
    ]);
  });

  it('should move a handled application after a pending one', () => {
    const applications = [application('a', NotificationState.Accepted), application('b', NotificationState.NotSeen)];

    expect(pipe.transform(applications).map(a => a.applicantId)).toEqual(['b', 'a']);
  });

  it('should not sort the input array in place', () => {
    const applications = [application('a', NotificationState.Accepted), application('b', NotificationState.NotSeen)];

    const sorted = pipe.transform(applications);

    expect(sorted).not.toBe(applications);
    expect(applications.map(a => a.applicantId)).toEqual(['a', 'b']);
  });
});
