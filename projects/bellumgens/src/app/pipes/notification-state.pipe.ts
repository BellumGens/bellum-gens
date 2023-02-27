import { Pipe, PipeTransform } from '@angular/core';
import { NotificationState } from '../../../../common/src/public_api';

@Pipe({
    name: 'notificationState',
    standalone: true
})
export class NotificationStatePipe implements PipeTransform {
  private stateMap = ['Not seen', 'Seen', 'Rejected', 'Accepted'];

  public transform(value: NotificationState): string {
    return this.stateMap[value];
  }

}
