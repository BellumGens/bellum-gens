import { Pipe, PipeTransform } from '@angular/core';
import { TournamentParticipant } from '../../../../common/src/public_api';

@Pipe({
    name: 'notInGroup',
    standalone: true
})
export class NotInGroupPipe implements PipeTransform {

  public transform(value: TournamentParticipant [], key: string, _?: number): any {
    if (value) {
      return value.filter(r => !r[key]);
    }
    return null;
  }

}
