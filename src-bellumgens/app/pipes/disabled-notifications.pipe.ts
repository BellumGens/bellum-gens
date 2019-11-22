import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, NotificationState } from '../../../src-common/models/usernotifications';

@Pipe({
  name: 'disabledNotifications'
})
export class DisabledNotificationsPipe implements PipeTransform {

  transform(notification: NotificationState, returnActive: boolean = false): boolean {
    if (returnActive) {
      return notification !== NotificationState.Accepted && notification !== NotificationState.Rejected;
    }
    return notification === NotificationState.Accepted || notification === NotificationState.Rejected;
  }

}
