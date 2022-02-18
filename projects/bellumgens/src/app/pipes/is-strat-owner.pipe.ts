import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationUser, CSGOStrategy } from '../../../../common/src/public_api';

@Pipe({
  name: 'isStratOwner'
})
export class IsStratOwnerPipe implements PipeTransform {

  public transform(authUser: ApplicationUser, strat: CSGOStrategy): any {
    if (authUser && strat) {
      return strat.userId === authUser.id;
    }
    return false;
  }

}
