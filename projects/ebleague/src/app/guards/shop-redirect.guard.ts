import { DOCUMENT, LOCALE_ID, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn } from '@angular/router';
import { environment } from '../../../../common/src/environments/environment';

/** Builds the bellumgens.com URL for a shop path, keeping the language the visitor was using. */
export const shopRedirectUrl = (url: string, locale: string): string => {
  const lang = locale.toLowerCase().startsWith('bg') ? '/bg' : '';
  return `${environment.bellumgens}${lang}${url}`;
};

/**
 * The shop moved to bellumgens.com. The Express server answers direct hits with a 301; this guard covers
 * in-app navigation and service-worker served shells, where the router sees the URL before the server does.
 */
export const shopRedirectGuard: CanActivateFn = (_route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  inject(DOCUMENT).location.assign(shopRedirectUrl(state.url, inject(LOCALE_ID)));
  return false;
};
