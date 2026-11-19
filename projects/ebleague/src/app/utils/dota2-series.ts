import { TournamentDota2Match, TournamentDota2MatchGame } from 'bellum-gens-common/models';

/** The name of one of the two teams of a series, or an empty string when the id is neither of them. */
export const dota2TeamName = (match: TournamentDota2Match, teamId: string | null | undefined): string => {
  if (!teamId) {
    return '';
  }
  if (teamId === match.team1Id) {
    return match.team1?.teamName ?? '';
  }
  if (teamId === match.team2Id) {
    return match.team2?.teamName ?? '';
  }
  return '';
};

/** The team on the Dire side of a game: the team of the series that isn't on the Radiant side. */
export const dota2DireTeamId = (match: TournamentDota2Match, radiantTeamId: string | null | undefined): string | null => {
  if (!radiantTeamId) {
    return null;
  }
  if (radiantTeamId === match.team1Id) {
    return match.team2Id ?? null;
  }
  if (radiantTeamId === match.team2Id) {
    return match.team1Id ?? null;
  }
  return null;
};

/** Whether a series has a result: a walkover, or at least one game won. */
export const dota2SeriesPlayed = (match: TournamentDota2Match): boolean =>
  !!match.noShow || (match.team1Points ?? 0) + (match.team2Points ?? 0) > 0;

/** Whether a played series ended level, e.g. a best of two that ended 1-1. */
export const dota2SeriesDrawn = (match: TournamentDota2Match): boolean =>
  !match.noShow && dota2SeriesPlayed(match) && match.team1Points === match.team2Points;

/** The games of a series in the order they were played. */
export const dota2SortedGames = (match: TournamentDota2Match): TournamentDota2MatchGame [] =>
  [...(match.games ?? [])].sort((a, b) => a.gameNumber - b.gameNumber);

/** The games of a series a team won. With games on record, this is the team's score in the series. */
export const dota2GamesWon = (match: TournamentDota2Match, teamId: string | null | undefined): number =>
  teamId ? (match.games ?? []).filter(game => game.winnerTeamId === teamId).length : 0;
