import { Pipe, PipeTransform } from '@angular/core';
import { RegistrationsCount, Game } from '../../../src-common/models/tournament';

@Pipe({
  name: 'getRegCount'
})
export class GetRegCountPipe implements PipeTransform {

  public transform(regisrations: RegistrationsCount [], game: Game): number {
    if (regisrations) {
      return regisrations.find(r => r.game === game).count;
    }
    return 0;
  }

}
