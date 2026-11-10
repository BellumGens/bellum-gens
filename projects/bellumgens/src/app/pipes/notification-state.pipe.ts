import { Pipe, PipeTransform } from '@angular/core';
import { NotificationState } from 'bellum-gens-common/models';

@Pipe({
    name: 'notificationState'
})
export class NotificationStatePipe implements PipeTransform {
  private stateMap = ['Not seen', 'Seen', 'Rejected', 'Accepted'];

  public transform(value: NotificationState): string {
    return this.stateMap[value];
  }

}
