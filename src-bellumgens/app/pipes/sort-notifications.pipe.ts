import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification } from '../../../src-common/models/usernotifications';

@Pipe({
  name: 'sortNotifications'
})
export class SortNotificationsPipe implements PipeTransform {

  transform(notifications: UserNotification []): UserNotification [] {
    return notifications && notifications.sort((x, y) => x.State === y.State ? 0 : x.State > y.State ? 1 : -1);
  }

}
