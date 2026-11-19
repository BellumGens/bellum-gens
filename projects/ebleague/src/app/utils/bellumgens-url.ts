import { environment } from 'bellum-gens-common/environments';
import { SOURCE_LOCALE, matchLocale } from 'bellum-gens-common';

/**
 * Builds a bellumgens.com URL for a path, keeping the language the visitor was using.
 * The locale prefix is always set, as bellumgens.com would otherwise pick one from the browser language.
 */
export const bellumgensUrl = (path: string, locale: string): string =>
  `${environment.bellumgens}/${matchLocale(locale) ?? SOURCE_LOCALE}${path}`;
