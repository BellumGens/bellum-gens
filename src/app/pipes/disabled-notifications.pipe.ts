import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, InviteState } from '../models/usernotifications';

@Pipe({
  name: 'disabledNotifications'
})
export class DisabledNotificationsPipe implements PipeTransform {

  transform(notification: UserNotification): boolean {
    return notification.State === InviteState.Accepted || notification.State === InviteState.Rejected;
  }

}
