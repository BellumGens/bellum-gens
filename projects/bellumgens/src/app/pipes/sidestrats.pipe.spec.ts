import { SideStratsPipe } from './sidestrats.pipe';
import { CSGOMap, CSGOMapPool, CSGOStrategy, Side, StratOrderBy, StrategyVote, VoteDirection } from '../../../../common/src/public_api';

const strat = (id: string, map: CSGOMap, overrides: Partial<CSGOStrategy> = {}): CSGOStrategy => ({
  id,
  teamId: null,
  side: Side.TSide,
  title: id,
  description: '',
  url: '',
  map,
  ...overrides
});

const votes = (up: number, down: number): StrategyVote [] => [
  ...Array.from({ length: up }, (_, i) => ({ vote: VoteDirection.Up, userId: `up-${i}` })),
  ...Array.from({ length: down }, (_, i) => ({ vote: VoteDirection.Down, userId: `down-${i}` }))
];

describe('SideStratsPipe', () => {
  const pipe = new SideStratsPipe();
  const pool: CSGOMapPool [] = [
    { mapId: CSGOMap.Mirage, isPlayed: true },
    { mapId: CSGOMap.Inferno, isPlayed: true },
    { mapId: CSGOMap.Nuke, isPlayed: false }
  ];

  it('keeps only the strategies for maps in the played pool', () => {
    const strats = [strat('mirage', CSGOMap.Mirage), strat('nuke', CSGOMap.Nuke), strat('inferno', CSGOMap.Inferno)];

    expect(pipe.transform(strats, pool, null).map(s => s.id)).toEqual(['mirage', 'inferno']);
  });

  it('orders the most recently updated strategies first', () => {
    // The API sends the dates as ISO strings
    const updated = (iso: string) => iso as unknown as Date;
    const strats = [
      strat('old', CSGOMap.Mirage, { lastUpdated: updated('2024-01-01T00:00:00') }),
      strat('new', CSGOMap.Mirage, { lastUpdated: updated('2024-06-01T00:00:00') }),
      strat('same-as-old', CSGOMap.Inferno, { lastUpdated: updated('2024-01-01T00:00:00') }),
      strat('middle', CSGOMap.Inferno, { lastUpdated: updated('2024-03-01T00:00:00') })
    ];

    expect(pipe.transform(strats, pool, StratOrderBy.MostRecent).map(s => s.id)).toEqual(['new', 'middle', 'old', 'same-as-old']);
  });

  it('orders dates the same way whether they arrive as strings or as dates', () => {
    const strats = [
      strat('old', CSGOMap.Mirage, { lastUpdated: new Date('2024-01-01T00:00:00Z') }),
      strat('new', CSGOMap.Mirage, { lastUpdated: new Date('2024-06-01T00:00:00Z') }),
      strat('same-as-old', CSGOMap.Inferno, { lastUpdated: new Date('2024-01-01T00:00:00Z') })
    ];

    expect(pipe.transform(strats, pool, StratOrderBy.MostRecent).map(s => s.id)).toEqual(['new', 'old', 'same-as-old']);
  });

  it('leaves out a strategy for a map that is not in the pool', () => {
    const strats = [strat('mirage', CSGOMap.Mirage), strat('vertigo', CSGOMap.Vertigo)];

    expect(pipe.transform(strats, pool, null).map(s => s.id)).toEqual(['mirage']);
  });

  it('orders the strategies by their vote balance, unvoted ones counting as zero', () => {
    const strats = [
      strat('unvoted', CSGOMap.Mirage),
      strat('loved', CSGOMap.Mirage, { votes: votes(3, 0) }),
      strat('disliked', CSGOMap.Inferno, { votes: votes(0, 2) }),
      strat('mixed', CSGOMap.Inferno, { votes: votes(2, 1) })
    ];

    expect(pipe.transform(strats, pool, StratOrderBy.TopVoted).map(s => s.id)).toEqual(['loved', 'mixed', 'unvoted', 'disliked']);
  });

  it('keeps the order of strategies with the same vote balance', () => {
    const strats = [strat('a', CSGOMap.Mirage, { votes: votes(1, 0) }), strat('b', CSGOMap.Mirage, { votes: votes(2, 1) })];

    expect(pipe.transform(strats, pool, StratOrderBy.TopVoted).map(s => s.id)).toEqual(['a', 'b']);
  });

  it('does not change the list it was given', () => {
    const strats = [strat('nuke', CSGOMap.Nuke), strat('mirage', CSGOMap.Mirage, { votes: votes(1, 0) })];

    pipe.transform(strats, pool, StratOrderBy.TopVoted);

    expect(strats.map(s => s.id)).toEqual(['nuke', 'mirage']);
  });

  it('has nothing to show until both the strategies and the map pool are loaded', () => {
    expect(pipe.transform(null, pool, StratOrderBy.MostRecent)).toBeNull();
    expect(pipe.transform([strat('mirage', CSGOMap.Mirage)], null, StratOrderBy.TopVoted)).toBeNull();
  });
});
