import { Pipe, PipeTransform } from '@angular/core';
import { TournamentParticipant } from 'bellum-gens-common/models';

@Pipe({
    name: 'notInGroup'
})
export class NotInGroupPipe implements PipeTransform {

  public transform(value: TournamentParticipant [] | null | undefined, key: keyof TournamentParticipant, _?: number): TournamentParticipant [] | null {
    if (value) {
      return value.filter(r => !r[key]);
    }
    return null;
  }

}
