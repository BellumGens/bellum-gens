import { DisabledNotificationsPipe } from './disabled-notifications.pipe';
import { NotificationState } from '../../../../common/src/public_api';

describe('DisabledNotificationsPipe', () => {
  const pipe = new DisabledNotificationsPipe();

  it('disables notifications that were already answered', () => {
    expect(pipe.transform(NotificationState.Accepted)).toBe(true);
    expect(pipe.transform(NotificationState.Rejected)).toBe(true);
    expect(pipe.transform(NotificationState.NotSeen)).toBe(false);
    expect(pipe.transform(NotificationState.Seen)).toBe(false);
  });

  it('reports the notifications still waiting for an answer when asked for the active ones', () => {
    expect(pipe.transform(NotificationState.NotSeen, true)).toBe(true);
    expect(pipe.transform(NotificationState.Seen, true)).toBe(true);
    expect(pipe.transform(NotificationState.Accepted, true)).toBe(false);
    expect(pipe.transform(NotificationState.Rejected, true)).toBe(false);
  });
});
