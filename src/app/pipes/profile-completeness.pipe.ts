import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationUser } from '../models/applicationuser';
import { PlaystyleRole } from '../models/playerrole';

@Pipe({
  name: 'profileCompleteness'
})
export class ProfileCompletenessPipe implements PipeTransform {

  transform(user: ApplicationUser, type = false): number | string {
    let completeness = 0;
    if (user.Availability.find(a => a.Available)) {
      completeness++;
    }
    if (user.PreferredPrimaryRole !== PlaystyleRole.NotSet) {
      completeness++;
    }
    if (user.PreferredSecondaryRole !== PlaystyleRole.NotSet) {
      completeness++;
    }
    if (user.MapPool.find(m => m.IsPlayed)) {
      completeness++;
    }
    if (type) {
      return completeness <= 1 ? 'danger' : completeness >= 4 ? 'success' : 'warning';
    }
    return completeness;
  }

}
