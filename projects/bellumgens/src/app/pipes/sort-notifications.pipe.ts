import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification } from '../../../../common/src/public_api';

@Pipe({
    name: 'sortNotifications'
})
export class SortNotificationsPipe implements PipeTransform {

  public transform(notifications: UserNotification [] | null | undefined, _?: number): UserNotification [] | null | undefined {
    return notifications && [...notifications].sort((x, y) => x.state - y.state);
  }

}
