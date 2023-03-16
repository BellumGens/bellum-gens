import { Pipe, PipeTransform } from '@angular/core';
import { RegistrationsCount, Game } from '../../../../common/src/public_api';

@Pipe({
    name: 'getRegCount',
    standalone: true
})
export class GetRegCountPipe implements PipeTransform {

  public transform(regisrations: RegistrationsCount [], game: Game): number {
    if (regisrations) {
      return regisrations.find(r => r.game === game).count;
    }
    return 0;
  }

}
