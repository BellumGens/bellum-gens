import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { CartService } from './cart.service';
import { ApiShopService } from './bellumgens-api.shop.service';
import { Brand, DeliveryMethod, Product, ProductType, ProductVariant, Quote } from '../models/shop';

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
    localStorage.clear();
    configure();
  });

  afterEach(() => {
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

  it('asks the API for a quote after the cart changes', fakeAsync(() => {
    service.add(product());
    TestBed.tick();
    tick(300);

    const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.lines).toEqual([{ productId: 'p1', variantId: undefined, quantity: 1 }]);
    expect(req.request.body.deliveryMethod).toBe(DeliveryMethod.Courier);
    req.flush(quoteFor(21));

    expect(service.quote()?.total).toBe(21);
    expect(service.quoting()).toBe(false);
  }));

  it('debounces rapid changes into a single quote request', fakeAsync(() => {
    const p = product();
    service.add(p);
    TestBed.tick();
    tick(100);
    service.add(p);
    TestBed.tick();
    tick(300);

    const requests = httpMock.match(`${api['_apiEndpoint']}/shop/quote`);
    expect(requests.length).toBe(1);
    expect(requests[0].request.body.lines[0].quantity).toBe(2);
    requests[0].flush(quoteFor(36));
  }));

  it('clears the quote when the cart is emptied', fakeAsync(() => {
    service.add(product());
    TestBed.tick();
    tick(300);
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/quote`).flush(quoteFor(21));

    service.clear();
    TestBed.tick();
    tick(300);

    expect(service.quote()).toBeNull();
    expect(service.promoCode()).toBeNull();
    expect(localStorage.getItem(CartService.storageKey)).toBeNull();
  }));
});
