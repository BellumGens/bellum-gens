import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, NotificationState } from '../../../src-common/models/usernotifications';

@Pipe({
  name: 'unreadNotifications'
})
export class UnreadNotificationsPipe implements PipeTransform {

  transform(notifications: UserNotification []): number {
    return notifications ? notifications.filter(n => n.State === NotificationState.NotSeen).length : 0;
  }

}
