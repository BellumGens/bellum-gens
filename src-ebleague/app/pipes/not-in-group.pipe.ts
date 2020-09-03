import { Pipe, PipeTransform } from '@angular/core';
import { TournamentRegistration } from '../../../src-common/models/tournament';

@Pipe({
  name: 'notInGroup'
})
export class NotInGroupPipe implements PipeTransform {

  transform(value: TournamentRegistration [], key: string, t?: number): any {
    if (value) {
      return value.filter(r => !r[key]);
    }
    return null;
  }

}
