import { Pipe, PipeTransform } from '@angular/core';
import { TeamApplication } from '../../../src-common/models/csgoteam';

@Pipe({
  name: 'sortApplications'
})
export class SortApplicationsPipe implements PipeTransform {

  public transform(notifications: TeamApplication []): TeamApplication [] {
    return notifications && notifications.sort((x, y) => x.state > y.state ? 1 : 0);
  }

}
