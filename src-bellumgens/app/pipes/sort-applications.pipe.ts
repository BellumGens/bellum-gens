import { Pipe, PipeTransform } from '@angular/core';
import { TeamApplication } from '../../../src-common/models/csgoteam';

@Pipe({
  name: 'sortApplications'
})
export class SortApplicationsPipe implements PipeTransform {

  transform(notifications: TeamApplication []): TeamApplication [] {
    return notifications && notifications.sort((x, y) => x.State > y.State ? 1 : 0);
  }

}
