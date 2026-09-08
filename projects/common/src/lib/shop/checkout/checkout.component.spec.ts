import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../../services/cart.service';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { Brand, Product, ProductType, Quote } from '../../../models/shop';

const umbrella: Product = {
  id: 'p1',
  name: 'Umbrella',
  slug: 'umbrella',
  type: ProductType.Umbrella,
  brand: Brand.BellumGens,
  price: 15,
  galleryUrls: [],
  active: true,
  sortOrder: 0,
  variants: []
};

const validQuote: Quote = {
  lines: [{ productId: 'p1', productName: 'Umbrella', unitPrice: 15, quantity: 1, lineTotal: 15 }],
  subtotal: 15,
  discountTotal: 0,
  shippingCost: 6,
  total: 21,
  currency: 'EUR',
  promoApplied: false,
  freeShipping: false,
  isValid: true
};

describe('CheckoutComponent', () => {
  let fixture: ComponentFixture<CheckoutComponent>;
  let component: CheckoutComponent;
  let httpMock: HttpTestingController;
  let cart: CartService;
  let api: ApiShopService;
  let assign: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      // LoginService (used to prefill the email) depends on SwPush, so the service worker module is registered disabled.
      imports: [CheckoutComponent, NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false })],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    cart = TestBed.inject(CartService);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    assign = vi.fn();
    // The component leaves the page through document.location, which jsdom does not allow spying on.
    component['document'] = { location: { assign } } as unknown as Document;
    fixture.detectChanges();
    // LoginService checks for a signed in user on creation; answer as a guest.
    httpMock.match(request => request.url.includes('/api/account')).forEach(request => request.flush(null));
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  const quoteUrl = () => `${api['_apiEndpoint']}/shop/quote`;

  /** Answers whatever quote requests the cart's debounced pipeline has issued so far. */
  const flushQuotes = (quote: Quote) => {
    TestBed.tick();
    tick(300);
    httpMock.match(quoteUrl()).forEach(request => request.flush(quote));
  };

  const fillCart = () => {
    cart.add(umbrella);
    flushQuotes(validQuote);
    cart.quote.set(validQuote);
    fixture.detectChanges();
  };

  const fillForm = () => {
    component.form.setValue({
      firstName: 'Ivan',
      lastName: 'Petrov',
      email: 'ivan@example.com',
      phoneNumber: '+359 888 123 456',
      city: 'Sofia',
      streetAddress: 'bul. Vitosha 1',
      postalCode: '1000',
      customerNote: '',
      acceptedTerms: true
    });
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not submit an invalid form', fakeAsync(() => {
    fillCart();

    component.pay();

    httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
    expect(component.form.touched).toBe(true);
    expect(component.submitting()).toBe(false);
  }));

  it('requires the terms of sale to be accepted', fakeAsync(() => {
    fillCart();
    fillForm();
    component.form.controls.acceptedTerms.setValue(false);

    component.pay();

    httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
  }));

  it('posts the cart and customer details, clears the cart and redirects to Revolut', fakeAsync(() => {
    fillCart();
    fillForm();

    component.pay();

    const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.lines).toEqual([{ productId: 'p1', variantId: undefined, quantity: 1 }]);
    expect(req.request.body.email).toBe('ivan@example.com');
    expect(req.request.body.acceptedTerms).toBe(true);
    expect(req.request.body.country).toBe('BG');
    expect(['bg', 'en']).toContain(req.request.body.language);
    req.flush({ orderId: 'o1', orderNumber: 'BG-2026-000001', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });

    expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/x');
    expect(cart.isEmpty()).toBe(true);
    flushQuotes(validQuote);
  }));

  it('shows the server problems on a 409 and re-prices the cart', fakeAsync(() => {
    fillCart();
    fillForm();

    component.pay();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`)
      .flush({ problems: ['Umbrella: Sold out.'], quote: { ...validQuote, isValid: false } }, { status: 409, statusText: 'Conflict' });

    expect(component.problems()).toEqual(['Umbrella: Sold out.']);
    expect(component.submitting()).toBe(false);
    expect(assign).not.toHaveBeenCalled();
    // The component re-prices the cart after a rejection.
    flushQuotes({ ...validQuote, isValid: false });
  }));

  it('explains when payments are unavailable', fakeAsync(() => {
    fillCart();
    fillForm();

    component.pay();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`)
      .flush('Payments are temporarily unavailable.', { status: 503, statusText: 'Service Unavailable' });

    expect(component.problems().length).toBe(1);
    flushQuotes(validQuote);
  }));
});
