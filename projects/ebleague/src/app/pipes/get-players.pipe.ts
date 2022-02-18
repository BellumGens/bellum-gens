import { Pipe, PipeTransform } from '@angular/core';
import { TournamentParticipant } from '../../../../common/src/public_api';

@Pipe({
  name: 'getPlayers'
})
export class GetPlayersPipe implements PipeTransform {

  public transform(registrations: TournamentParticipant [], player1id: string, player2id: string): TournamentParticipant [] {
    if (registrations) {
      return registrations.filter(r => r.userId === player1id || r.userId === player2id);
    }
    return null;
  }

}
