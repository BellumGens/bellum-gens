import type { RequestHandler } from 'express';
import { LOCALE_CODES, LOCALE_COOKIE, SOURCE_LOCALE, matchLocale } from '../lib/languages/languages';

/** Supported locales of an `Accept-Language` header, most preferred first. */
export const acceptedLocales = (header: string | undefined): string[] => {
  if (!header) {
    return [];
  }
  return header.split(',')
    .map((entry, index) => {
      const [tag, ...params] = entry.split(';');
      const q = params.map(p => p.trim()).find(p => p.startsWith('q='));
      const quality = q === undefined ? 1 : Number(q.slice(2));
      return { tag: tag.trim(), quality: Number.isNaN(quality) ? 0 : quality, index };
    })
    .filter(({ tag, quality }) => tag && tag !== '*' && quality > 0)
    // Array.prototype.sort is stable, but the index keeps the header order explicit for equal weights.
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
    .map(({ tag }) => matchLocale(tag))
    .filter((code): code is string => code !== undefined);
};

/** The locale a visitor explicitly picked earlier, from the `Cookie` header. */
export const cookieLocale = (header: string | undefined): string | undefined => {
  const value = header?.split(';')
    .map(c => c.trim().split('='))
    .find(([name]) => name === LOCALE_COOKIE)?.[1];
  return value && LOCALE_CODES.includes(value) ? value : undefined;
};

/**
 * The locale to serve a visitor without one in the URL: the language they picked before,
 * else the best match of their browser languages, else the source locale.
 */
export const preferredLocale = (cookie: string | undefined, acceptLanguage: string | undefined): string =>
  cookieLocale(cookie) ?? acceptedLocales(acceptLanguage)[0] ?? SOURCE_LOCALE;

/**
 * Redirects page requests whose path does not start with a locale (a visitor's first load, e.g. a typed
 * address, a bookmark or an external link) to the same path under their preferred locale.
 * Requests under a locale prefix are never redirected, so in-app navigation and reloads keep the language
 * the visitor is browsing in. Mount it after the static file handlers, so unprefixed files still resolve.
 */
export const localeRedirect = (): RequestHandler => (req, res, next) => {
  const [, firstSegment] = req.path.split('/');
  if ((req.method !== 'GET' && req.method !== 'HEAD') || LOCALE_CODES.includes(firstSegment)) {
    next();
    return;
  }
  const locale = preferredLocale(req.get('Cookie'), req.get('Accept-Language'));
  res.vary('Accept-Language');
  res.vary('Cookie');
  res.set('Cache-Control', 'no-store');
  res.redirect(302, `/${locale}${req.originalUrl}`);
};
