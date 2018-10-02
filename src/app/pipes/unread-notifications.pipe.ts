import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, InviteState } from '../models/usernotifications';

@Pipe({
  name: 'unreadNotifications'
})
export class UnreadNotificationsPipe implements PipeTransform {

  transform(notifications: UserNotification []): number {
    return notifications.filter(n => n.State === InviteState.NotSeen).length;
  }

}
