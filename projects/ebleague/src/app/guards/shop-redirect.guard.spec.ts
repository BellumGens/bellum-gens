import { TestBed } from '@angular/core/testing';
import { DOCUMENT, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { shopRedirectGuard, shopRedirectUrl } from './shop-redirect.guard';
import { environment } from '../../../../common/src/environments/environment';

describe('shopRedirectGuard', () => {
  const state = { url: '/shop/cart?x=1' } as RouterStateSnapshot;
  const route = {} as ActivatedRouteSnapshot;

  it('builds bellumgens.com URLs with the language prefix', () => {
    expect(shopRedirectUrl('/shop', 'bg')).toBe(`${environment.bellumgens}/bg/shop`);
    expect(shopRedirectUrl('/shop/product/umbrella', 'bg-BG')).toBe(`${environment.bellumgens}/bg/shop/product/umbrella`);
    expect(shopRedirectUrl('/shop/cart', 'en-US')).toBe(`${environment.bellumgens}/shop/cart`);
  });

  it('redirects the browser and blocks the navigation', () => {
    const assign = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: LOCALE_ID, useValue: 'bg' },
        { provide: DOCUMENT, useValue: { location: { assign } } }
      ]
    });

    const result = TestBed.runInInjectionContext(() => shopRedirectGuard(route, state));

    expect(result).toBe(false);
    expect(assign).toHaveBeenCalledWith(`${environment.bellumgens}/bg/shop/cart?x=1`);
  });

  it('lets the server render without touching the browser', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: LOCALE_ID, useValue: 'en' },
        { provide: DOCUMENT, useValue: { location: { assign: vi.fn() } } }
      ]
    });

    const result = TestBed.runInInjectionContext(() => shopRedirectGuard(route, state));

    expect(result).toBe(true);
  });
});
