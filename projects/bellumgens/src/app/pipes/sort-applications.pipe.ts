import { Pipe, PipeTransform } from '@angular/core';
import { TeamApplication } from 'bellum-gens-common/models';

@Pipe({
    name: 'sortApplications'
})
export class SortApplicationsPipe implements PipeTransform {

  public transform(notifications: TeamApplication [] | null | undefined, _?: number): TeamApplication [] | null | undefined {
    return notifications && [...notifications].sort((x, y) => x.state - y.state);
  }

}
