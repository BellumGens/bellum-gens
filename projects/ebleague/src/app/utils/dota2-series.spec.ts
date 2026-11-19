import { CSGOTeam, TournamentDota2Match } from 'bellum-gens-common/models';
import { dota2DireTeamId, dota2GamesWon, dota2SeriesDrawn, dota2SeriesPlayed, dota2SortedGames, dota2TeamName } from './dota2-series';

const team = (teamId: string, teamName: string): CSGOTeam => ({ teamId, teamName, teamAvatar: '', visible: true });

describe('dota2 series helpers', () => {
  const series = (overrides: Partial<TournamentDota2Match> = {}): TournamentDota2Match => ({
    id: 'm1',
    team1Id: 'team-1',
    team2Id: 'team-2',
    team1: team('team-1', 'Alpha'),
    team2: team('team-2', 'Bravo'),
    ...overrides
  });

  it('names either team of the series by its id', () => {
    expect(dota2TeamName(series(), 'team-1')).toBe('Alpha');
    expect(dota2TeamName(series(), 'team-2')).toBe('Bravo');
    expect(dota2TeamName(series(), 'team-3')).toBe('');
    expect(dota2TeamName(series(), null)).toBe('');
    expect(dota2TeamName(series({ team1: undefined }), 'team-1')).toBe('');
  });

  it('puts the other team of the series on the Dire side', () => {
    expect(dota2DireTeamId(series(), 'team-1')).toBe('team-2');
    expect(dota2DireTeamId(series(), 'team-2')).toBe('team-1');
    expect(dota2DireTeamId(series(), 'team-3')).toBeNull();
    expect(dota2DireTeamId(series(), null)).toBeNull();
    expect(dota2DireTeamId(series(), undefined)).toBeNull();
  });

  it('treats a series with games won or a walkover as played', () => {
    expect(dota2SeriesPlayed(series())).toBe(false);
    expect(dota2SeriesPlayed(series({ team1Points: 0, team2Points: 0 }))).toBe(false);
    expect(dota2SeriesPlayed(series({ team1Points: 2, team2Points: 0 }))).toBe(true);
    expect(dota2SeriesPlayed(series({ team1Points: 0, team2Points: 1 }))).toBe(true);
    expect(dota2SeriesPlayed(series({ noShow: true }))).toBe(true);
  });

  it('treats only a played series with level scores as drawn', () => {
    expect(dota2SeriesDrawn(series({ team1Points: 1, team2Points: 1 }))).toBe(true);
    expect(dota2SeriesDrawn(series({ team1Points: 2, team2Points: 1 }))).toBe(false);
    expect(dota2SeriesDrawn(series({ team1Points: 0, team2Points: 0 }))).toBe(false);
    expect(dota2SeriesDrawn(series())).toBe(false);
    expect(dota2SeriesDrawn(series({ noShow: true }))).toBe(false);
  });

  it('orders the games of a series by their number without reordering the series itself', () => {
    const games = [{ id: 'g2', gameNumber: 2 }, { id: 'g3', gameNumber: 3 }, { id: 'g1', gameNumber: 1 }];
    const match = series({ games });

    expect(dota2SortedGames(match).map(g => g.id)).toEqual(['g1', 'g2', 'g3']);
    expect(match.games!.map(g => g.id)).toEqual(['g2', 'g3', 'g1']);
    expect(dota2SortedGames(series())).toEqual([]);
  });
});

describe('dota2GamesWon', () => {
  const match: TournamentDota2Match = {
    team1Id: 't1',
    team2Id: 't2',
    games: [
      { gameNumber: 1, winnerTeamId: 't1', radiantTeamId: null, steamMatchId: null },
      { gameNumber: 2, winnerTeamId: 't2', radiantTeamId: null, steamMatchId: null },
      { gameNumber: 3, winnerTeamId: 't1', radiantTeamId: null, steamMatchId: null },
      { gameNumber: 4, winnerTeamId: null, radiantTeamId: null, steamMatchId: null }
    ]
  };

  it('counts the games each team won', () => {
    expect(dota2GamesWon(match, 't1')).toBe(2);
    expect(dota2GamesWon(match, 't2')).toBe(1);
  });

  it('is 0 without a team or without games', () => {
    expect(dota2GamesWon(match, null)).toBe(0);
    expect(dota2GamesWon({ team1Id: 't1' }, 't1')).toBe(0);
  });
});
