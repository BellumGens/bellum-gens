import { MatchDurationPipe } from './match-duration.pipe';

describe('MatchDurationPipe', () => {
  const pipe = new MatchDurationPipe();

  it('formats minutes and zero padded seconds', () => {
    expect(pipe.transform(0)).toBe('0:00');
    expect(pipe.transform(65)).toBe('1:05');
    expect(pipe.transform(2251)).toBe('37:31');
  });

  it('adds the hours past the hour', () => {
    expect(pipe.transform(3600)).toBe('1:00:00');
    expect(pipe.transform(3729)).toBe('1:02:09');
  });

  it('drops fractions of a second', () => {
    expect(pipe.transform(65.9)).toBe('1:05');
  });

  it('returns an empty string for missing or invalid values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(-1)).toBe('');
    expect(pipe.transform(Number.NaN)).toBe('');
  });
});
