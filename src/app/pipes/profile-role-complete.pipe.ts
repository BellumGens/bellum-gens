import { Pipe, PipeTransform } from '@angular/core';
import { PlaystyleRole } from '../models/playerrole';

@Pipe({
  name: 'profileRoleComplete'
})
export class ProfileRoleCompletePipe implements PipeTransform {

  transform(role: PlaystyleRole, css = false): string {
    if (css) {
      return role === PlaystyleRole.NotSet ? 'color-error' : 'color-success';
    }
    return role === PlaystyleRole.NotSet ? 'error' : 'done';
  }

}
