import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification } from '../models/usernotifications';

@Pipe({
  name: 'sortNotifications'
})
export class SortNotificationsPipe implements PipeTransform {

  transform(notifications: UserNotification []): UserNotification [] {
    return notifications && notifications.sort((x, y) => x.State > y.State ? 1 : 0);
  }

}
