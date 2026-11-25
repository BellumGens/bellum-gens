import { Dota2HeroNamePipe } from './dota2-hero-name.pipe';

describe('Dota2HeroNamePipe', () => {
  const pipe = new Dota2HeroNamePipe();

  it('returns the name of the hero', () => {
    expect(pipe.transform({ heroId: 1, heroName: 'Anti-Mage' })).toBe('Anti-Mage');
  });

  it('falls back to the hero id when the name is unknown', () => {
    expect(pipe.transform({ heroId: 42, heroName: null })).toBe('Hero #42');
    expect(pipe.transform({ heroId: 42, heroName: '' })).toBe('Hero #42');
  });

  it('returns an empty string without a hero', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
