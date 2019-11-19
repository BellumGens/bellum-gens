import { Pipe, PipeTransform } from '@angular/core';
import { RegistrationsCount, Game } from '../models/tournament';

@Pipe({
  name: 'getRegCount'
})
export class GetRegCountPipe implements PipeTransform {

  transform(regisrations: RegistrationsCount [], game: Game): number {
    if (regisrations) {
      return regisrations.find(r => r.game === game).count;
    }
    return 0;
  }

}
