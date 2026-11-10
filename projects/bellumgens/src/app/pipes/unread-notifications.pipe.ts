import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification, NotificationState } from 'bellum-gens-common/models';

@Pipe({
    name: 'unreadNotifications'
})
export class UnreadNotificationsPipe implements PipeTransform {

  public transform(notifications: UserNotification [] | null | undefined): number {
    return notifications ? notifications.filter(n => n.state === NotificationState.NotSeen).length : 0;
  }

}
