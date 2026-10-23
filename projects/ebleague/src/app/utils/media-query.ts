import { DestroyRef, PLATFORM_ID, Signal, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** The width below which the tournament pages switch to their phone layout. */
export const NARROW_SCREEN_QUERY = '(max-width: 720px)';

/**
 * Tracks whether a CSS media query matches. Always `false` on the server.
 * Must be called in an injection context.
 */
export function mediaQuery(query: string): Signal<boolean> {
  const matches = signal(false);

  if (isPlatformBrowser(inject(PLATFORM_ID)) && typeof window.matchMedia === 'function') {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => matches.set(event.matches);
    matches.set(mql.matches);
    mql.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', onChange));
  }

  return matches.asReadonly();
}
