export interface Language {
  /** Locale ID of the localized build, also the URL prefix it is served under. */
  code: string;
  /** Name of the language in that language. */
  label: string;
  /** File name (without extension) of the flag in assets/country-flags/svg. */
  flag: string;
}

/** The locale the templates are authored in. */
export const SOURCE_LOCALE = 'en';

/** Cookie remembering the language a visitor explicitly picked, read by the server on unprefixed requests. */
export const LOCALE_COOKIE = 'locale';

/** Every locale the apps are built in. Keep in sync with `i18n.locales` in angular.json. */
export const LANGUAGES: readonly Language[] = [
  { code: 'en', label: 'English', flag: 'united-kingdom' },
  { code: 'bg', label: 'Български', flag: 'bulgaria' },
  { code: 'de', label: 'Deutsch', flag: 'germany' },
  { code: 'fr', label: 'Français', flag: 'france' },
  { code: 'nl', label: 'Nederlands', flag: 'netherlands' },
  { code: 'nb', label: 'Norsk', flag: 'norway' },
  { code: 'sv', label: 'Svenska', flag: 'sweden' },
  { code: 'pl', label: 'Polski', flag: 'republic-of-poland' },
  { code: 'ro', label: 'Română', flag: 'romania' }
];

export const LOCALE_CODES = LANGUAGES.map(l => l.code);

/** Language tags that should be served by a locale with a different code. */
const LOCALE_ALIASES: Readonly<Record<string, string>> = {
  // Generic Norwegian and Nynorsk readers get Bokmål.
  no: 'nb',
  nn: 'nb'
};

/**
 * Maps a BCP 47 language tag (`de-AT`, `nb_NO`, `NO`) to one of the supported locale codes,
 * or `undefined` when the language is not supported.
 */
export const matchLocale = (tag: string): string | undefined => {
  const [language] = tag.trim().toLowerCase().split(/[-_]/, 1);
  const code = LOCALE_ALIASES[language] ?? language;
  return LOCALE_CODES.includes(code) ? code : undefined;
};
