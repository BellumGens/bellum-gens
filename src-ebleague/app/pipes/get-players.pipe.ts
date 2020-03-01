import { Pipe, PipeTransform } from '@angular/core';
import { TournamentRegistration } from '../../../src-common/models/tournament';

@Pipe({
  name: 'getPlayers'
})
export class GetPlayersPipe implements PipeTransform {

  transform(registrations: TournamentRegistration [], player1id: string, player2id: string): TournamentRegistration [] {
    if (registrations) {
      return registrations.filter(r => r.UserId === player1id || r.UserId === player2id);
    }
    return null;
  }

}
