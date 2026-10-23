import { ParticipantTeamPipe } from './participant-team.pipe';

describe('ParticipantTeamPipe', () => {
  const pipe = new ParticipantTeamPipe();

  it('should return the trimmed team name', () => {
    expect(pipe.transform('Acme')).toBe('Acme');
    expect(pipe.transform('  Team Liquid ')).toBe('Team Liquid');
    expect(pipe.transform('Teamless Wonders')).toBe('Teamless Wonders');
  });

  it('should return an empty string for participants without a team', () => {
    for (const team of [null, undefined, '', '   ', '[]', '()', '(teamless)', 'Teamless', '[teamless]', 'none', 'N/A', '-']) {
      expect(pipe.transform(team)).toBe('');
    }
  });
});
