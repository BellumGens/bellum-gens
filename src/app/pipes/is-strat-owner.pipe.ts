import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationUser } from '../models/applicationuser';
import { CSGOStrategy } from '../models/csgostrategy';

@Pipe({
  name: 'isStratOwner'
})
export class IsStratOwnerPipe implements PipeTransform {

  transform(authUser: ApplicationUser, strat: CSGOStrategy): any {
    if (authUser && strat) {
      return strat.UserId === authUser.id;
    }
    return false;
  }

}
