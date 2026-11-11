import { Pipe, PipeTransform } from '@angular/core';
import { NotificationState } from 'bellum-gens-common/models';

@Pipe({
    name: 'disabledNotifications'
})
export class DisabledNotificationsPipe implements PipeTransform {

  public transform(notification: NotificationState, returnActive: boolean = false): boolean {
    if (returnActive) {
      return notification !== NotificationState.Accepted && notification !== NotificationState.Rejected;
    }
    return notification === NotificationState.Accepted || notification === NotificationState.Rejected;
  }

}
