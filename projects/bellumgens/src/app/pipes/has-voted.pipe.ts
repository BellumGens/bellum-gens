import { Pipe, PipeTransform } from '@angular/core';
import { StrategyVote, VoteDirection, ApplicationUser } from '../../../../common/src/public_api';

@Pipe({
    name: 'hasVoted',
    standalone: true
})
export class HasVotedPipe implements PipeTransform {
  private hasVotedClass = 'user-has-voted';

  public transform(votes: StrategyVote [], direction: VoteDirection, authUser: ApplicationUser, _?: number): string {
    if (votes) {
      if (authUser) {
        return votes.find(v => v.vote === direction && v.userId === authUser.id) ? this.hasVotedClass : '';
      }
    }
    return '';
  }

}
