import { Pipe, PipeTransform } from '@angular/core';
import { StrategyVote, VoteDirection } from '../../../src-common/models/csgostrategy';

@Pipe({
  name: 'votes'
})
export class VotesPipe implements PipeTransform {

  public transform(votes: StrategyVote [], direction = VoteDirection.Up, _?: number): number {
    return votes && votes.filter(v => v.vote === direction).length;
  }

}
