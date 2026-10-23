import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { mediaQuery } from './media-query';

describe('mediaQuery', () => {
  let listeners: ((event: MediaQueryListEvent) => void)[];
  let removeEventListener: ReturnType<typeof vi.fn>;
  let originalMatchMedia: typeof window.matchMedia;

  const mockMatchMedia = (matches: boolean) => {
    listeners = [];
    removeEventListener = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({
      matches,
      addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.push(listener),
      removeEventListener
    }) as unknown as typeof window.matchMedia;
  };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should reflect the initial match state of the query', () => {
    mockMatchMedia(true);
    const matches = TestBed.runInInjectionContext(() => mediaQuery('(max-width: 720px)'));
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 720px)');
    expect(matches()).toBe(true);
  });

  it('should update when the query match state changes', () => {
    mockMatchMedia(false);
    const matches = TestBed.runInInjectionContext(() => mediaQuery('(max-width: 720px)'));
    expect(matches()).toBe(false);
    listeners.forEach(l => l({ matches: true } as MediaQueryListEvent));
    expect(matches()).toBe(true);
  });

  it('should stop listening when its injector is destroyed', () => {
    mockMatchMedia(false);
    TestBed.runInInjectionContext(() => mediaQuery('(max-width: 720px)'));
    TestBed.resetTestingModule();
    expect(removeEventListener).toHaveBeenCalled();
  });

  it('should be false on the server', () => {
    mockMatchMedia(true);
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const matches = TestBed.runInInjectionContext(() => mediaQuery('(max-width: 720px)'));
    expect(matches()).toBe(false);
    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});
