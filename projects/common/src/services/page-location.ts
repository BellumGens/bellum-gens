import { DOCUMENT, InjectionToken, inject } from '@angular/core';

/**
 * The location of the current page. Injected rather than read from `window` so full page navigations
 * (e.g. to the other site) can be stubbed and asserted in tests.
 */
export const PAGE_LOCATION = new InjectionToken<Pick<Location, 'href' | 'origin' | 'pathname'>>('PAGE_LOCATION', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).location
});
