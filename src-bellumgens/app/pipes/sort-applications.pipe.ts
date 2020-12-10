import { Pipe, PipeTransform } from '@angular/core';
import { TeamApplication } from '../../../src-common/models/csgoteam';

@Pipe({
  name: 'sortApplications'
})
export class SortApplicationsPipe implements PipeTransform {

  transform(notifications: TeamApplication [], t?: number): TeamApplication [] {
    return notifications && notifications.sort((x, y) => x.state > y.state ? 1 : 0);
  }

}
