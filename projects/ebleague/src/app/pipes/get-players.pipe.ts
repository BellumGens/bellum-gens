import { Pipe, PipeTransform } from '@angular/core';
import { TournamentParticipant } from 'bellum-gens-common/models';

@Pipe({
    name: 'getPlayers'
})
export class GetPlayersPipe implements PipeTransform {

  public transform(registrations: TournamentParticipant [] | null | undefined, player1id?: string, player2id?: string): TournamentParticipant [] | null {
    if (registrations) {
      return registrations.filter(r => r.userId === player1id || r.userId === player2id);
    }
    return null;
  }

}
