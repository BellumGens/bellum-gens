import { Pipe, PipeTransform } from '@angular/core';
import { TournamentParticipant } from '../../../src-common/models/tournament';

@Pipe({
  name: 'sortByPoints'
})
export class SortByPointsPipe implements PipeTransform {

  public transform(participants: TournamentParticipant [], key: string): any {
    if (participants) {
      return participants.sort((a, b) => a[key] === b[key] ? 0 : a[key] > b[key] ? -1 : 1);
    }
    return null;
  }

}
