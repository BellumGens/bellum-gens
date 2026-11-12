import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { CartService, fingerprint } from './cart.service';
import { ApiShopService } from './bellumgens-api.shop.service';
import { AVAILABLE_DELIVERY_METHODS, Brand, DeliveryMethod, Product, ProductType, ProductVariant, Quote } from 'bellum-gens-common/models';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Umbrella',
  slug: 'umbrella',
  type: ProductType.Umbrella,
  brand: Brand.BellumGens,
  price: 15,
  galleryUrls: [],
  active: true,
  sortOrder: 0,
  variants: [],
  ...overrides
});

const variant = (id: string, name: string): ProductVariant => ({ id, name, active: true, sortOrder: 0 });

const quoteFor = (total: number): Quote => ({
  lines: [],
  subtotal: total - 6,
  discountTotal: 0,
  shippingCost: 6,
  total,
  currency: 'EUR',
  promoApplied: false,
  freeShipping: false,
  isValid: true
});

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let api: ApiShopService;

  const configure = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
    localStorage.clear();
    configure();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Adding to the cart reads the per-line limit, which loads the storefront settings; tests that care flush it themselves.
    httpMock.match(`${api['_apiEndpoint']}/shop/settings`);
    httpMock.verify();
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(service.isEmpty()).toBe(true);
    expect(service.count()).toBe(0);
    expect(service.deliveryMethod()).toBe(DeliveryMethod.Courier);
  });

  it('merges lines for the same product and variant', () => {
    const p = product();

    service.add(p);
    service.add(p, null, 2);

    expect(service.items().length).toBe(1);
    expect(service.count()).toBe(3);
  });

  it('keeps different variants of one product on separate lines', () => {
    const p = product({ id: 'jersey', variants: [variant('v1', 'Male / L'), variant('v2', 'Female / M')] });

    service.add(p, p.variants[0]);
    service.add(p, p.variants[1]);

    expect(service.items().length).toBe(2);
    expect(service.lines()).toEqual([
      { productId: 'jersey', variantId: 'v1', quantity: 1 },
      { productId: 'jersey', variantId: 'v2', quantity: 1 }
    ]);
  });

  it('changes only the line it is asked to', () => {
    service.add(product());
    service.add(product({ id: 'p2', name: 'Pen' }));
    service.add(product({ id: 'p2', name: 'Pen' }));

    service.setQuantity(service.items()[0], 3);

    expect(service.items().map(i => i.quantity)).toEqual([3, 2]);
  });

  it('ignores adding less than one item', () => {
    service.add(product(), null, 0);

    expect(service.isEmpty()).toBe(true);
  });

  it('removes a line when its quantity drops to zero', () => {
    service.add(product());

    service.setQuantity(service.items()[0], 0);

    expect(service.isEmpty()).toBe(true);
  });

  it('normalizes promo codes', () => {
    service.setPromoCode('  save10 ');
    expect(service.promoCode()).toBe('SAVE10');

    service.setPromoCode('');
    expect(service.promoCode()).toBeNull();
  });

  it('persists the cart to localStorage and restores it for a new instance', () => {
    service.add(product(), null, 2);
    service.setPromoCode('save10');
    TestBed.tick();

    const stored = JSON.parse(localStorage.getItem(CartService.storageKey) ?? '{}');
    expect(stored.items[0].productId).toBe('p1');
    expect(stored.items[0].quantity).toBe(2);
    expect(stored.promoCode).toBe('SAVE10');

    TestBed.resetTestingModule();
    configure();

    expect(service.count()).toBe(2);
    expect(service.promoCode()).toBe('SAVE10');
  });

  it('blocks checkout while a promo code the customer entered does not apply', () => {
    service.add(product());
    TestBed.tick();
    vi.advanceTimersByTime(300);
    httpMock.match(r => r.url.endsWith('/shop/quote')).forEach(r => r.flush(null));
    const quote = {
      lines: [{ productId: 'p1', unitPrice: 15, quantity: 1, lineTotal: 15 }],
      subtotal: 15, discountTotal: 0, shippingCost: 6, total: 21, currency: 'EUR', freeShipping: false, isValid: true
    };

    service['_quote'].set({ ...quote, promoApplied: false });
    expect(service.canCheckout()).toBe(true);

    service['_quote'].set({ ...quote, promoCode: 'SUMMER10', promoApplied: false, promoProblem: 'Promo code has expired.' });
    expect(service.canCheckout()).toBe(false);

    service['_quote'].set({ ...quote, promoCode: 'SUMMER10', promoApplied: true, discountTotal: 1.5 });
    expect(service.canCheckout()).toBe(true);

    service['_quote'].set({ ...quote, promoApplied: false, isValid: false });
    expect(service.canCheckout()).toBe(false);
  });

  it('remembers the order placed from the cart across reloads, and forgets it when cleared', () => {
    service.add(product());
    service.setPendingOrder('o1', 'fp-1');
    TestBed.tick();

    TestBed.resetTestingModule();
    configure();

    expect(service.pendingOrder()).toEqual({ id: 'o1', fingerprint: 'fp-1' });
    expect(service.pendingOrderFor('fp-1')).toBe('o1');
    expect(service.pendingOrderFor('fp-2')).toBeNull();

    service.clear();
    expect(service.pendingOrder()).toBeNull();
    httpMock.match(r => r.url.endsWith('/shop/quote')).forEach(r => r.flush(null));
  });

  it('fingerprints a request without keeping its contents', () => {
    const request = { email: 'ivan@example.com', city: 'Sofia' };

    expect(fingerprint(request)).toBe(fingerprint({ ...request }));
    expect(fingerprint(request)).not.toBe(fingerprint({ ...request, city: 'Plovdiv' }));
    expect(fingerprint(request)).not.toContain('ivan');
  });

  it('falls back to courier delivery when the saved delivery method is no longer offered', () => {
    // Event pickup is not offered until the next event is announced.
    expect(AVAILABLE_DELIVERY_METHODS).not.toContain(DeliveryMethod.EventPickup);
    service.add(product());
    service.setDeliveryMethod(DeliveryMethod.EventPickup);
    TestBed.tick();

    TestBed.resetTestingModule();
    configure();

    expect(service.deliveryMethod()).toBe(DeliveryMethod.Courier);
  });

  it('discards a stored cart it cannot read', () => {
    TestBed.resetTestingModule();
    localStorage.setItem(CartService.storageKey, '{not json');

    configure();

    expect(service.isEmpty()).toBe(true);
    expect(localStorage.getItem(CartService.storageKey)).toBeNull();
  });

  it('does not ask for a fresh quote for an empty cart', () => {
    service.refresh();

    httpMock.expectNone(`${api['_apiEndpoint']}/shop/quote`);
    expect(service.quoting()).toBe(false);
  });

  it('asks the API for a quote after the cart changes', () => {
    service.add(product());
    TestBed.tick();
    vi.advanceTimersByTime(300);

    const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.lines).toEqual([{ productId: 'p1', variantId: undefined, quantity: 1 }]);
    expect(req.request.body.deliveryMethod).toBe(DeliveryMethod.Courier);
    req.flush(quoteFor(21));

    expect(service.quote()?.total).toBe(21);
    expect(service.quoting()).toBe(false);
  });

  it('debounces rapid changes into a single quote request', () => {
    const p = product();
    service.add(p);
    TestBed.tick();
    vi.advanceTimersByTime(100);
    service.add(p);
    TestBed.tick();
    vi.advanceTimersByTime(300);

    const requests = httpMock.match(`${api['_apiEndpoint']}/shop/quote`);
    expect(requests.length).toBe(1);
    expect(requests[0].request.body.lines[0].quantity).toBe(2);
    requests[0].flush(quoteFor(36));
  });

  it('clears the quote when the cart is emptied', () => {
    service.add(product());
    TestBed.tick();
    vi.advanceTimersByTime(300);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush(quoteFor(21));

    service.clear();
    TestBed.tick();
    vi.advanceTimersByTime(300);

    expect(service.quote()).toBeNull();
    expect(service.promoCode()).toBeNull();
    expect(localStorage.getItem(CartService.storageKey)).toBeNull();
  });

  it('cancels a pending quote as soon as the cart changes and keeps quoting until the new one arrives', () => {
    const p = product();
    service.add(p);
    TestBed.tick();
    vi.advanceTimersByTime(300);
    const stale = httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`);

    service.add(p);
    TestBed.tick();

    expect(stale.cancelled).toBe(true);
    expect(service.quoting()).toBe(true);

    vi.advanceTimersByTime(300);
    const fresh = httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`);
    expect(fresh.request.body.lines[0].quantity).toBe(2);
    expect(service.quoting()).toBe(true);
    fresh.flush(quoteFor(36));

    expect(service.quote()?.total).toBe(36);
    expect(service.quoting()).toBe(false);
  });

  it('lets a cart change cancel a manual refresh', () => {
    const p = product();
    service.add(p);
    TestBed.tick();
    vi.advanceTimersByTime(300);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush(quoteFor(21));

    service.refresh();
    const refresh = httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`);
    service.setQuantity(service.items()[0], 2);
    TestBed.tick();

    expect(refresh.cancelled).toBe(true);
    vi.advanceTimersByTime(300);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush(quoteFor(36));
    expect(service.quote()?.total).toBe(36);
  });

  it('still works when browser storage is blocked', () => {
    TestBed.resetTestingModule();
    const blocked = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    try {
      configure();
      service.add(product());
      TestBed.tick();

      expect(service.count()).toBe(1);
    } finally {
      blocked.mockRestore();
    }
    vi.advanceTimersByTime(300);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush(quoteFor(21));
  });

  it('caps a line at the default per-line maximum until the settings are loaded', () => {
    const p = product();
    service.add(p, null, 8);
    service.add(p, null, 5);

    expect(service.items()[0].quantity).toBe(CartService.defaultMaxLineQuantity);

    service.setQuantity(service.items()[0], 50);

    expect(service.items()[0].quantity).toBe(CartService.defaultMaxLineQuantity);
  });

  it('caps a line at the per-line maximum the admin set', () => {
    expect(service.maxLineQuantity()).toBe(CartService.defaultMaxLineQuantity);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/settings`)
      .flush({ shippingCost: 6, freeShippingThreshold: 50, maxQuantityPerLine: 20, currency: 'EUR' });
    expect(service.maxLineQuantity()).toBe(20);

    const p = product();
    service.add(p, null, 15);
    expect(service.items()[0].quantity).toBe(15);
    service.add(p, null, 15);
    expect(service.items()[0].quantity).toBe(20);

    service.setQuantity(service.items()[0], 50);
    expect(service.items()[0].quantity).toBe(20);
  });

  it('keeps the default per-line maximum when the settings fail to load, and picks up the limit from a later load', () => {
    expect(service.maxLineQuantity()).toBe(CartService.defaultMaxLineQuantity);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/settings`).flush('', { status: 500, statusText: 'Server Error' });

    expect(service.maxLineQuantity()).toBe(CartService.defaultMaxLineQuantity);
    expect(api.settings()).toBeNull();
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/settings`)
      .flush({ shippingCost: 6, freeShippingThreshold: 50, maxQuantityPerLine: 5, currency: 'EUR' });
    expect(service.maxLineQuantity()).toBe(5);
  });

  it('reports a failed quote so the page can offer a retry, and clears it on success', () => {
    service.add(product());
    TestBed.tick();
    vi.advanceTimersByTime(300);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush('', { status: 500, statusText: 'Server Error' });

    expect(service.quote()).toBeNull();
    expect(service.quoteFailed()).toBe(true);
    expect(service.quoting()).toBe(false);

    service.refresh();
    expect(service.quoting()).toBe(true);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush(quoteFor(21));

    expect(service.quoteFailed()).toBe(false);
    expect(service.quote()?.total).toBe(21);
  });
});
