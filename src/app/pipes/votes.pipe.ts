import { Pipe, PipeTransform } from '@angular/core';
import { StrategyVote, VoteDirection } from '../models/csgostrategy';

@Pipe({
  name: 'votes'
})
export class VotesPipe implements PipeTransform {

  transform(votes: StrategyVote [], direction = VoteDirection.Up): number {
    return votes && votes.filter(v => v.Vote === direction).length;
  }

}
