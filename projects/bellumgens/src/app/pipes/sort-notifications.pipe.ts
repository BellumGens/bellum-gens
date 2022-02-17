import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification } from '../../../../common/src/public_api';

@Pipe({
  name: 'sortNotifications'
})
export class SortNotificationsPipe implements PipeTransform {

  public transform(notifications: UserNotification [], _?: number): UserNotification [] {
    return notifications && notifications.sort((x, y) => x.state === y.state ? 0 : x.state > y.state ? 1 : -1);
  }

}
