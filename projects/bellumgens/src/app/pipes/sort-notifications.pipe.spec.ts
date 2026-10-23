import { SortNotificationsPipe } from './sort-notifications.pipe';
import { CSGOTeam, NotificationState, UserNotification } from '../../../../common/src/public_api';

const notification = (teamId: string, state: NotificationState): UserNotification =>
  ({ state, teamInfo: { teamId } as CSGOTeam, invitingUser: null, sent: '' });

describe('SortNotificationsPipe', () => {
  const pipe = new SortNotificationsPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a falsy input as is', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should sort the notifications by state', () => {
    const notifications = [
      notification('a', NotificationState.Rejected),
      notification('b', NotificationState.NotSeen),
      notification('c', NotificationState.Accepted),
      notification('d', NotificationState.Seen)
    ];

    expect(pipe.transform(notifications).map(n => n.teamInfo.teamId)).toEqual(['b', 'd', 'a', 'c']);
  });

  it('should not sort the input array in place', () => {
    const notifications = [notification('a', NotificationState.Accepted), notification('b', NotificationState.NotSeen)];

    const sorted = pipe.transform(notifications);

    expect(sorted).not.toBe(notifications);
    expect(sorted.map(n => n.teamInfo.teamId)).toEqual(['b', 'a']);
    expect(notifications.map(n => n.teamInfo.teamId)).toEqual(['a', 'b']);
  });
});
