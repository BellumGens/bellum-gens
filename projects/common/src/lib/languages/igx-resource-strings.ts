import { changei18n } from '@infragistics/igniteui-angular/core';
import {
  IgxResourceStringsBG,
  IgxResourceStringsDE,
  IgxResourceStringsFR,
  IgxResourceStringsNB,
  IgxResourceStringsNL,
  IgxResourceStringsPL,
  IgxResourceStringsRO,
  IgxResourceStringsSV
} from 'igniteui-angular-i18n';

/** Ignite UI component strings per locale. The source locale uses the built-in English ones. */
const RESOURCE_STRINGS: Readonly<Record<string, Parameters<typeof changei18n>[0]>> = {
  bg: IgxResourceStringsBG,
  de: IgxResourceStringsDE,
  fr: IgxResourceStringsFR,
  nb: IgxResourceStringsNB,
  nl: IgxResourceStringsNL,
  pl: IgxResourceStringsPL,
  ro: IgxResourceStringsRO,
  sv: IgxResourceStringsSV
};

/** Switches the Ignite UI components to the strings of the given locale, when it has any. */
export const localizeIgniteUI = (locale: string): void => {
  const strings = RESOURCE_STRINGS[locale];
  if (strings) {
    changei18n(strings);
  }
};
