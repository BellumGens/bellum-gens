import { Pipe, PipeTransform } from '@angular/core';
import { StrategyVote, VoteDirection } from '../../../src-common/models/csgostrategy';
import { ApplicationUser } from '../../../src-common/models/applicationuser';

@Pipe({
  name: 'hasVoted'
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
