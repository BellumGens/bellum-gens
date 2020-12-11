import { Pipe, PipeTransform } from '@angular/core';
import { TournamentParticipant } from '../../../src-common/models/tournament';

@Pipe({
  name: 'notInGroup'
})
export class NotInGroupPipe implements PipeTransform {

  transform(value: TournamentParticipant [], key: string, t?: number): any {
    if (value) {
      return value.filter(r => !r[key]);
    }
    return null;
  }

}
