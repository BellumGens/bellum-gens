import { CSGOTeam, Game } from 'bellum-gens-common/models';
import { TeamGameNamePipe } from './team-game-name.pipe';

describe('TeamGameNamePipe', () => {
  const pipe = new TeamGameNamePipe();
  const team = (game?: Game): CSGOTeam => ({ teamName: 'Team', teamAvatar: '', visible: true, game });

  it('returns the name of the game of the team', () => {
    expect(pipe.transform(team(Game.CSGO))).toBe('Counter-Strike');
    expect(pipe.transform(team(Game.Dota2))).toBe('Dota 2');
  });

  it('treats a team without a game as a Counter-Strike team', () => {
    expect(pipe.transform(team())).toBe('Counter-Strike');
  });

  it('returns an empty string without a team', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
