import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, NotificationState } from '../models/usernotifications';

@Pipe({
  name: 'disabledNotifications'
})
export class DisabledNotificationsPipe implements PipeTransform {

  transform(notification: NotificationState): boolean {
    return notification === NotificationState.Accepted || notification === NotificationState.Rejected;
  }

}
