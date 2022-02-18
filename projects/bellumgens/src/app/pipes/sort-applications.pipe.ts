import { Pipe, PipeTransform } from '@angular/core';
import { TeamApplication } from '../../../../common/src/public_api';

@Pipe({
  name: 'sortApplications'
})
export class SortApplicationsPipe implements PipeTransform {

  public transform(notifications: TeamApplication [], _?: number): TeamApplication [] {
    return notifications && notifications.sort((x, y) => x.state > y.state ? 1 : 0);
  }

}
