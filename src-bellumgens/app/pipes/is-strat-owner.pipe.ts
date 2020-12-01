import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { CSGOStrategy } from '../../../src-common/models/csgostrategy';

@Pipe({
  name: 'isStratOwner'
})
export class IsStratOwnerPipe implements PipeTransform {

  transform(authUser: ApplicationUser, strat: CSGOStrategy): any {
    if (authUser && strat) {
      return strat.userId === authUser.id;
    }
    return false;
  }

}
