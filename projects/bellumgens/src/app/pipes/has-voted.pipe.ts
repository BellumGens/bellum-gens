import { Pipe, PipeTransform } from '@angular/core';
import { StrategyVote, VoteDirection, ApplicationUser } from 'bellum-gens-common/models';

@Pipe({
    name: 'hasVoted'
})
export class HasVotedPipe implements PipeTransform {
  private hasVotedClass = 'user-has-voted';

  public transform(votes: StrategyVote [] | null | undefined, direction: VoteDirection, authUser: ApplicationUser | null): string {
    if (votes) {
      if (authUser) {
        return votes.find(v => v.vote === direction && v.userId === authUser.id) ? this.hasVotedClass : '';
      }
    }
    return '';
  }

}
