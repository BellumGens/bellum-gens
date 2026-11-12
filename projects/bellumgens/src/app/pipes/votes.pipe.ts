import { Pipe, PipeTransform } from '@angular/core';
import { StrategyVote, VoteDirection } from 'bellum-gens-common/models';

@Pipe({
    name: 'votes'
})
export class VotesPipe implements PipeTransform {

  public transform(votes: StrategyVote [] | undefined, direction = VoteDirection.Up): number | undefined {
    return votes && votes.filter(v => v.vote === direction).length;
  }

}
