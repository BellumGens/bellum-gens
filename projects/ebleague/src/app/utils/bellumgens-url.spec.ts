import { environment } from 'bellum-gens-common/environments';
import { bellumgensUrl } from './bellumgens-url';

describe('bellumgensUrl', () => {
  it('should prefix the path with the visitor\'s locale', () => {
    expect(bellumgensUrl('/team/alpha', 'de')).toBe(`${environment.bellumgens}/de/team/alpha`);
    expect(bellumgensUrl('/team/alpha', 'bg-BG')).toBe(`${environment.bellumgens}/bg/team/alpha`);
  });

  it('should fall back to English for a locale bellumgens.com does not have', () => {
    expect(bellumgensUrl('/team/alpha', 'ja')).toBe(`${environment.bellumgens}/en/team/alpha`);
  });
});
