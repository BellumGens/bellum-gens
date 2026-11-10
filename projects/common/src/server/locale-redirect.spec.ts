import type { NextFunction, Request, Response } from 'express';
import { acceptedLocales, cookieLocale, localeRedirect, preferredLocale } from './locale-redirect';

describe('locale negotiation', () => {
  describe('acceptedLocales', () => {
    it('should return nothing without a header', () => {
      expect(acceptedLocales(undefined)).toEqual([]);
      expect(acceptedLocales('')).toEqual([]);
      expect(acceptedLocales('*')).toEqual([]);
    });

    it('should match regional variants to their language', () => {
      expect(acceptedLocales('de-AT')).toEqual(['de']);
      expect(acceptedLocales('fr-CA,fr;q=0.9')).toEqual(['fr', 'fr']);
      expect(acceptedLocales('PL')).toEqual(['pl']);
      expect(acceptedLocales('sv_SE')).toEqual(['sv']);
    });

    it('should serve every Norwegian variant with Bokmål', () => {
      expect(acceptedLocales('no')).toEqual(['nb']);
      expect(acceptedLocales('nn-NO')).toEqual(['nb']);
      expect(acceptedLocales('nb-NO')).toEqual(['nb']);
    });

    it('should order by quality, then by position, and drop unsupported or refused languages', () => {
      expect(acceptedLocales('ja, ro;q=0.5, nl;q=0.8, en-GB;q=0.8, bg;q=0')).toEqual(['nl', 'en', 'ro']);
    });

    it('should ignore malformed quality values', () => {
      expect(acceptedLocales('de;q=abc, fr')).toEqual(['fr']);
    });
  });

  describe('cookieLocale', () => {
    it('should read a supported locale from the cookie header', () => {
      expect(cookieLocale('theme=dark; locale=ro; other=1')).toBe('ro');
    });

    it('should ignore missing, unsupported or look-alike cookies', () => {
      expect(cookieLocale(undefined)).toBeUndefined();
      expect(cookieLocale('locale=ja')).toBeUndefined();
      expect(cookieLocale('mylocale=de')).toBeUndefined();
    });
  });

  describe('preferredLocale', () => {
    it('should prefer the picked language, then the browser language, then English', () => {
      expect(preferredLocale('locale=bg', 'de')).toBe('bg');
      expect(preferredLocale(undefined, 'ja, de;q=0.3')).toBe('de');
      expect(preferredLocale('locale=xx', 'ja')).toBe('en');
      expect(preferredLocale(undefined, undefined)).toBe('en');
    });
  });

  describe('localeRedirect', () => {
    const handler = localeRedirect();

    const run = (url: string, headers: Record<string, string> = {}, method = 'GET') => {
      const req = {
        method,
        originalUrl: url,
        path: url.split('?')[0],
        get: (name: string) => headers[name]
      } as unknown as Request;
      const res = {
        vary: vi.fn(),
        set: vi.fn(),
        redirect: vi.fn()
      };
      const next = vi.fn() as NextFunction;
      handler(req, res as unknown as Response, next);
      return { res, next };
    };

    it('should redirect a page without a locale to the browser language, keeping path and query', () => {
      const { res, next } = run('/players/abc?tab=1', { 'Accept-Language': 'fr-FR,fr;q=0.9' });

      expect(next).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(302, '/fr/players/abc?tab=1');
      expect(res.vary).toHaveBeenCalledWith('Accept-Language');
      expect(res.vary).toHaveBeenCalledWith('Cookie');
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
    });

    it('should redirect the root', () => {
      expect(run('/', { 'Accept-Language': 'nl' }).res.redirect).toHaveBeenCalledWith(302, '/nl/');
    });

    it('should let the picked language win over the browser language', () => {
      const { res } = run('/', { 'Accept-Language': 'nl', 'Cookie': 'locale=sv' });

      expect(res.redirect).toHaveBeenCalledWith(302, '/sv/');
    });

    it('should not redirect URLs that already have a locale', () => {
      for (const url of ['/en', '/bg/', '/nb/team/1', '/ro?x=1']) {
        const { res, next } = run(url, { 'Accept-Language': 'de' });

        expect(next).toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
      }
    });

    it('should treat only a whole first segment as a locale', () => {
      expect(run('/delivery', { 'Accept-Language': 'pl' }).res.redirect).toHaveBeenCalledWith(302, '/pl/delivery');
    });

    it('should not redirect requests other than GET and HEAD', () => {
      const { res, next } = run('/api', { 'Accept-Language': 'de' }, 'POST');

      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
      expect(run('/', {}, 'HEAD').res.redirect).toHaveBeenCalledWith(302, '/en/');
    });
  });
});
