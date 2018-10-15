import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, NotificationState } from '../models/usernotifications';

@Pipe({
  name: 'disabledNotifications'
})
export class DisabledNotificationsPipe implements PipeTransform {

  transform(notification: UserNotification): boolean {
    return notification.State === NotificationState.Accepted || notification.State === NotificationState.Rejected;
  }

}
