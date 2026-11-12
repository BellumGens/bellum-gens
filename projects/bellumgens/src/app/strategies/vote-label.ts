import { StrategyVote, VoteDirection } from 'bellum-gens-common/models';

/**
 * Accessible name of a vote button. The buttons only show an icon and, once there are votes, their count,
 * so the name says what the button does and repeats the count it shows.
 */
export function voteLabel(votes: StrategyVote [] | undefined, direction: VoteDirection) {
  const count = votes?.filter(v => v.vote === direction).length ?? 0;
  return direction === VoteDirection.Up ? $localize`Vote up: ${count}:count:` : $localize`Vote down: ${count}:count:`;
}
