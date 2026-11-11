import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CheckoutComponent } from './checkout.component';
import { CartService, ApiShopService, LoginService } from 'bellum-gens-common/services';
import {
  ApplicationUser,
  Brand,
  DeliveryMethod,
  PaymentMethod,
  Product,
  ProductType,
  Quote,
  SavedAddress
} from 'bellum-gens-common/models';

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
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
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
    vi.useRealTimers();
    httpMock.verify();
    localStorage.clear();
  });

  const quoteUrl = () => `${api['_apiEndpoint']}/shop/quote`;

  /** Answers whatever quote requests the cart's debounced pipeline has issued so far. */
  const flushQuotes = (quote: Quote) => {
    TestBed.tick();
    vi.advanceTimersByTime(300);
    httpMock.match(quoteUrl()).filter(request => !request.cancelled).forEach(request => request.flush(quote));
  };

  const fillCart = () => {
    cart.add(umbrella);
    flushQuotes(validQuote);
    cart['_quote'].set(validQuote);
    fixture.detectChanges();
  };

  const fillForm = (paymentMethod = PaymentMethod.Revolut) => {
    component.form.setValue({
      paymentMethod,
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

  it('points out every required field that is missing once payment is attempted', () => {
    fillCart();
    component.form.controls.phoneNumber.setValue('');

    component.pay();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('First name is required');
    expect(text).toContain('Last name is required');
    expect(text).toContain('A valid email is required for your receipt');
    expect(text).toContain('A phone number is required for the courier');
    expect(text).toContain('City is required');
    expect(text).toContain('Postal code is required');
    expect(text).toContain('Street address is required');
    expect(text).toContain('Please accept the terms of sale to continue');
  });

  it('summarizes the options, the discount and free shipping of the order', () => {
    fillCart();
    cart['_quote'].set({
      ...validQuote,
      lines: [{ productId: 'p1', variantId: 'v1', productName: 'Jersey', variantName: 'Male / L', unitPrice: 30, quantity: 1, lineTotal: 30 }],
      subtotal: 30,
      discountTotal: 3,
      shippingCost: 0,
      total: 27
    });
    fixture.detectChanges();

    const summary: HTMLElement = fixture.nativeElement.querySelector('.order-summary');
    expect(summary.querySelector('.line-variant')!.textContent).toContain('(Male / L)');
    expect(summary.textContent).toContain('Discount');
    expect(summary.textContent).toContain('-€3.00');
    expect(summary.textContent).toContain('Free');
  });

  it('shows the payment in progress until the order is created', () => {
    fillCart();
    fillForm();

    component.pay();
    fixture.detectChanges();

    const payButton: HTMLButtonElement = fixture.nativeElement.querySelector('.pay-button');
    expect(payButton.disabled).toBe(true);
    expect(payButton.querySelector('igx-circular-bar')).toBeTruthy();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`).flush({ orderId: 'o1', orderNumber: 'BG-1', checkoutUrl: 'https://checkout.revolut.com/x' });
  });

  it('does not submit an invalid form', () => {
    fillCart();

    component.pay();

    httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
    expect(component.form.touched).toBe(true);
    expect(component.submitting()).toBe(false);
  });

  it('requires the terms of sale to be accepted', () => {
    fillCart();
    fillForm();
    component.form.controls.acceptedTerms.setValue(false);

    component.pay();

    httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
  });

  it('links the terms of sale to the shop terms page', () => {
    fillCart();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.terms a');
    expect(link.getAttribute('href')).toBe('/shop/terms');
    expect(link.target).toBe('_blank');
  });

  it('offers a retry instead of a spinner when pricing the order failed', () => {
    fillCart();
    cart['_quote'].set(null);
    cart['_quoteFailed'].set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.order-summary igx-circular-bar')).toBeNull();
    const error: HTMLElement = fixture.nativeElement.querySelector('.quote-error');
    expect(error.textContent).toContain('could not calculate the price');

    error.querySelector('button')!.click();
    httpMock.expectOne(quoteUrl()).flush(validQuote);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.quote-error')).toBeNull();
  });

  it('posts the cart and customer details and redirects to Revolut, keeping the cart until the order is paid', () => {
    fillCart();
    fillForm();

    component.pay();

    const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.lines).toEqual([{ productId: 'p1', variantId: undefined, quantity: 1 }]);
    expect(req.request.body.email).toBe('ivan@example.com');
    expect(req.request.body.acceptedTerms).toBe(true);
    expect(req.request.body.replacesOrderId).toBeNull();
    expect(req.request.body.country).toBe('BG');
    expect(['bg', 'en']).toContain(req.request.body.language);
    req.flush({ orderId: 'o1', orderNumber: 'BG-2026-000001', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });

    expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/x');
    // Backing out of the payment must not lose the cart; the order page empties it once the order is paid.
    expect(cart.isEmpty()).toBe(false);
    expect(cart.pendingOrder()?.id).toBe('o1');
    flushQuotes(validQuote);
  });

  describe('cash on delivery', () => {
    const ordersUrl = () => `${api['_apiEndpoint']}/shop/orders`;

    it('offers paying online or on delivery, online by default', () => {
      fillCart();

      const radios = fixture.nativeElement.querySelectorAll('.payment-methods igx-radio');
      expect(radios.length).toBe(2);
      expect(fixture.nativeElement.querySelector('.payment-methods').textContent).toContain('Cash on delivery');
      expect(component.cashOnDelivery()).toBe(false);
      expect(fixture.nativeElement.querySelector('.pay-button').textContent).toContain('with Revolut');
    });

    it('places the order instead of paying, and says the courier collects the payment', () => {
      fillCart();
      fillForm(PaymentMethod.CashOnDelivery);
      fixture.detectChanges();

      expect(component.cashOnDelivery()).toBe(true);
      const payButton: HTMLElement = fixture.nativeElement.querySelector('.pay-button');
      expect(payButton.textContent).toContain('Place order for €21.00');
      expect(payButton.textContent).not.toContain('Revolut');
      expect(fixture.nativeElement.textContent).toContain('You pay the courier when your order arrives');
      expect(fixture.nativeElement.textContent).not.toContain("redirected to Revolut");
    });

    it('posts a cash on delivery order and shows it, without going to Revolut', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      fillCart();
      fillForm(PaymentMethod.CashOnDelivery);

      component.pay();

      const req = httpMock.expectOne(ordersUrl());
      expect(req.request.body.paymentMethod).toBe(PaymentMethod.CashOnDelivery);
      expect(req.request.body.deliveryMethod).toBe(DeliveryMethod.Courier);
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: null, expiresOn: '' });

      expect(assign).not.toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith(['/shop/order', 'o1']);
      expect(component.submitting()).toBe(false);
      // The order page empties the cart once it sees the order confirmed.
      expect(cart.pendingOrder()?.id).toBe('o1');
      flushQuotes(validQuote);
    });

    it('shows a placed order even when the cart changed while it was being placed', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      fillCart();
      fillForm(PaymentMethod.CashOnDelivery);

      component.pay();
      const req = httpMock.expectOne(ordersUrl());
      cart.add(umbrella);
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: null, expiresOn: '' });

      expect(navigate).toHaveBeenCalledWith(['/shop/order', 'o1']);
      expect(component.problems()).toEqual([]);
      flushQuotes(validQuote);
    });

    it('shows the order already placed instead of placing it twice', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      fillCart();
      fillForm(PaymentMethod.CashOnDelivery);
      component.pay();
      httpMock.expectOne(ordersUrl()).flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: null, expiresOn: '' });
      navigate.mockClear();

      component.pay();

      httpMock.expectOne(`${ordersUrl()}/o1`).flush({ id: 'o1', status: 6, canRetryPayment: false, checkoutUrl: null });
      httpMock.expectNone(r => r.method === 'POST' && r.url === ordersUrl());
      expect(navigate).toHaveBeenCalledWith(['/shop/order', 'o1']);
      flushQuotes(validQuote);
    });

    it('is not offered for an order picked up at an event', () => {
      fillCart();
      component.form.controls.paymentMethod.setValue(PaymentMethod.CashOnDelivery);
      cart.setDeliveryMethod(DeliveryMethod.EventPickup);
      TestBed.tick();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.payment-methods')).toBeNull();
      expect(component.cashOnDelivery()).toBe(false);
      expect(component.form.controls.paymentMethod.value).toBe(PaymentMethod.Revolut);
      flushQuotes(validQuote);
    });
  });

  describe('paying again for an order already placed', () => {
    const ordersUrl = () => `${api['_apiEndpoint']}/shop/orders`;
    const created = (orderId: string, checkoutUrl: string) =>
      ({ orderId, orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl, expiresOn: '' });
    const view = (overrides: Record<string, unknown>) => ({ id: 'o1', status: 0, canRetryPayment: false, checkoutUrl: null, ...overrides });

    /** Places the first order, as if the customer then came back from the payment page. */
    const placeFirstOrder = () => {
      fillCart();
      fillForm();
      component.pay();
      httpMock.expectOne(ordersUrl()).flush(created('o1', 'https://checkout.revolut.com/first'));
      assign.mockClear();
      component.submitting.set(false);
    };

    it('reopens the checkout that is still open instead of placing a second order', () => {
      placeFirstOrder();

      component.pay();

      httpMock.expectOne(`${ordersUrl()}/o1`).flush(view({ checkoutUrl: 'https://checkout.revolut.com/first' }));
      httpMock.expectNone(r => r.method === 'POST' && r.url === ordersUrl());
      expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/first');
      flushQuotes(validQuote);
    });

    it('starts a new payment for the same order after a declined one', () => {
      placeFirstOrder();

      component.pay();

      httpMock.expectOne(`${ordersUrl()}/o1`).flush(view({ canRetryPayment: true }));
      httpMock.expectOne(`${ordersUrl()}/o1/retry-payment`).flush(created('o1', 'https://checkout.revolut.com/retry'));
      expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/retry');
      flushQuotes(validQuote);
    });

    it('shows the order when it was paid already', async () => {
      placeFirstOrder();
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

      component.pay();

      httpMock.expectOne(`${ordersUrl()}/o1`).flush(view({ status: 1 }));
      expect(navigate).toHaveBeenCalledWith(['/shop/order', 'o1']);
      expect(assign).not.toHaveBeenCalled();
      expect(component.submitting()).toBe(false);
      flushQuotes(validQuote);
    });

    it('places a new order once the earlier one can no longer be paid', () => {
      placeFirstOrder();

      component.pay();

      httpMock.expectOne(`${ordersUrl()}/o1`).flush(view({ status: 4 }));
      httpMock.expectOne(r => r.method === 'POST' && r.url === ordersUrl()).flush(created('o2', 'https://checkout.revolut.com/second'));
      expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/second');
      expect(cart.pendingOrder()?.id).toBe('o2');
      flushQuotes(validQuote);
    });

    it('places a new order replacing the earlier one when the customer changed their details', () => {
      placeFirstOrder();
      component.form.controls.streetAddress.setValue('bul. Bulgaria 2');

      component.pay();

      httpMock.expectNone(`${ordersUrl()}/o1`);
      const req = httpMock.expectOne(r => r.method === 'POST' && r.url === ordersUrl());
      // The server releases the stock the earlier order holds, so the cart does not hold it twice.
      expect(req.request.body.replacesOrderId).toBe('o1');
      req.flush(created('o2', 'https://checkout.revolut.com/second'));
      expect(cart.pendingOrder()?.id).toBe('o2');
      flushQuotes(validQuote);
    });

    it('replaces the unpaid online order when the customer switches to cash on delivery', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      placeFirstOrder();
      component.form.controls.paymentMethod.setValue(PaymentMethod.CashOnDelivery);

      component.pay();

      httpMock.expectNone(`${ordersUrl()}/o1`);
      const req = httpMock.expectOne(r => r.method === 'POST' && r.url === ordersUrl());
      expect(req.request.body.paymentMethod).toBe(PaymentMethod.CashOnDelivery);
      expect(req.request.body.replacesOrderId).toBe('o1');
      req.flush({ ...created('o2', ''), checkoutUrl: null });
      expect(navigate).toHaveBeenCalledWith(['/shop/order', 'o2']);
      expect(cart.pendingOrder()?.id).toBe('o2');
      flushQuotes(validQuote);
    });
  });

  describe('picking up at an event', () => {
    beforeEach(() => {
      cart.setDeliveryMethod(DeliveryMethod.EventPickup);
      TestBed.tick();
    });

    it('asks for no address', () => {
      fillCart();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('#city')).toBeNull();
      expect(fixture.nativeElement.querySelector('#streetAddress')).toBeNull();
      expect(fixture.nativeElement.textContent).toContain('collect your order at our next event');
      flushQuotes(validQuote);
    });

    it('places the order without an address', () => {
      fillCart();
      component.form.patchValue({
        firstName: 'Ivan',
        lastName: 'Petrov',
        email: 'ivan@example.com',
        phoneNumber: '+359 888 123 456',
        acceptedTerms: true
      });

      component.pay();

      const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`);
      expect(req.request.body.deliveryMethod).toBe(DeliveryMethod.EventPickup);
      expect(req.request.body.city).toBeNull();
      expect(req.request.body.streetAddress).toBeNull();
      expect(req.request.body.postalCode).toBeNull();
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 15, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });
      flushQuotes(validQuote);
    });

    it('asks for the address again when switching back to courier delivery', () => {
      cart.setDeliveryMethod(DeliveryMethod.Courier);
      TestBed.tick();

      expect(component.form.controls.city.enabled).toBe(true);
      expect(component.form.controls.city.valid).toBe(false);
    });
  });

  it('does not let the customer pay while a promo code does not apply', () => {
    fillCart();
    fillForm();
    cart['_quote'].set({ ...validQuote, promoCode: 'SUMMER10', promoApplied: false, promoProblem: 'Promo code has expired.' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pay-button').disabled).toBe(true);
    component.pay();
    httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
    flushQuotes(validQuote);
  });

  it('abandons the pending order when the customer leaves checkout', () => {
    fillCart();
    fillForm();

    component.pay();
    const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`);
    fixture.destroy();

    expect(req.cancelled).toBe(true);
    expect(cart.isEmpty()).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });

  it('does not clear or pay for a cart that changed while the order was being created', () => {
    fillCart();
    fillForm();

    component.pay();
    const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`);
    cart.add(umbrella);
    req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });

    expect(assign).not.toHaveBeenCalled();
    expect(cart.count()).toBe(2);
    expect(component.submitting()).toBe(false);
    expect(component.problems()).toEqual(['Your cart has changed. Please review it before paying.']);
    flushQuotes(validQuote);
  });

  it('shows the server problems on a 409 and re-prices the cart', () => {
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
  });

  it('explains when payments are unavailable', () => {
    fillCart();
    fillForm();

    component.pay();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`)
      .flush('Payments are temporarily unavailable.', { status: 503, statusText: 'Service Unavailable' });

    expect(component.problems().length).toBe(1);
    flushQuotes(validQuote);
  });

  it('explains when payments are unavailable even without a message from the server', () => {
    fillCart();
    fillForm();

    component.pay();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`).flush('', { status: 503, statusText: 'Service Unavailable' });

    expect(component.problems()[0]).toContain('temporarily unavailable');
    flushQuotes(validQuote);
  });

  it('explains a rate limited attempt', () => {
    fillCart();
    fillForm();

    component.pay();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`).flush('', { status: 429, statusText: 'Too Many Requests' });

    expect(component.problems()[0]).toContain('Too many attempts');
    flushQuotes(validQuote);
  });

  it('falls back to a general message for an unexpected failure', () => {
    fillCart();
    fillForm();

    component.pay();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`).flush('', { status: 500, statusText: 'Server Error' });

    expect(component.problems()[0]).toContain('could not be placed');
    expect(component.submitting()).toBe(false);
    flushQuotes(validQuote);
  });

  it('refuses to pay a cart the server has since rejected', () => {
    fillCart();
    fillForm();
    cart['_quote'].set({ ...validQuote, isValid: false });

    component.pay();

    httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
    expect(component.problems()[0]).toContain('cart has changed');
    // The page re-prices the cart so the visitor sees what changed.
    flushQuotes(validQuote);
  });

  it('prefills the email of the signed in customer', () => {
    TestBed.inject(LoginService)['_applicationUser'].set({ email: 'ivan@example.com' } as unknown as ApplicationUser);
    TestBed.tick();

    expect(component.form.controls.email.value).toBe('ivan@example.com');
  });

  it('keeps an email the customer already typed', () => {
    component.form.controls.email.setValue('other@example.com');

    TestBed.inject(LoginService)['_applicationUser'].set({ email: 'ivan@example.com' } as unknown as ApplicationUser);
    TestBed.tick();

    expect(component.form.controls.email.value).toBe('other@example.com');
  });

  it('reports which fields are invalid to the template', () => {
    component.form.controls.city.markAsTouched();

    expect(component.invalid('city')).toBe(true);
    expect(component.invalid('postalCode')).toBe(false);
  });

  it('checks out in the language the storefront is running in', () => {
    expect(['bg', 'en']).toContain(component.language);
  });

  describe('delivering within Bulgaria', () => {
    it('says so, and fixes the country', () => {
      fillCart();

      expect(fixture.nativeElement.querySelector('.delivery-country').textContent).toContain('We currently deliver within Bulgaria only.');
      const country: HTMLInputElement = fixture.nativeElement.querySelector('#country');
      expect(country.value).toBe('Bulgaria');
      expect(country.readOnly).toBe(true);
      flushQuotes(validQuote);
    });

    it('requires a four-digit postal code, since several towns share a name', () => {
      fillCart();
      const postalCode = component.form.controls.postalCode;

      for (const [value, valid] of [['', false], ['100', false], ['10000', false], ['SW1A', false], ['1000', true]] as const) {
        postalCode.setValue(value);
        expect(postalCode.valid).toBe(valid);
      }
      // Typed into the field, as the customer would, so the page updates the hint.
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#postalCode');
      const type = (value: string) => {
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
      };
      type('');
      expect(fixture.nativeElement.textContent).toContain('Postal code is required');
      type('100');
      expect(fixture.nativeElement.textContent).toContain('A Bulgarian postal code has 4 digits');
      expect(fixture.nativeElement.textContent).not.toContain('Postal code is required');
      type('1000');
      expect(fixture.nativeElement.textContent).not.toContain('A Bulgarian postal code has 4 digits');
      flushQuotes(validQuote);
    });

    it('does not place a courier order without a postal code', () => {
      fillCart();
      fillForm();
      component.form.controls.postalCode.setValue('');

      component.pay();

      httpMock.expectNone(`${api['_apiEndpoint']}/shop/orders`);
      flushQuotes(validQuote);
    });

    it('sends Bulgaria as the country of the order', () => {
      fillCart();
      fillForm();

      component.pay();

      const req = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders`);
      expect(req.request.body.country).toBe('BG');
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });
      flushQuotes(validQuote);
    });
  });

  describe('saved addresses', () => {
    const addressesUrl = () => `${api['_apiEndpoint']}/shop/addresses`;
    const ordersUrl = () => `${api['_apiEndpoint']}/shop/orders`;
    const saved = (id: string, streetAddress: string, overrides: Partial<SavedAddress> = {}): SavedAddress => ({
      id,
      firstName: 'Ivan',
      lastName: 'Petrov',
      phoneNumber: '+359 888 123 456',
      city: 'Sofia',
      streetAddress,
      postalCode: '1000',
      country: 'BG',
      createdOn: '',
      lastUsedOn: '',
      ...overrides
    });
    const home = saved('a1', 'bul. Vitosha 1');
    const work = saved('a2', 'ul. Rakovski 10', { city: 'Plovdiv', postalCode: '4000' });

    const signIn = (addresses: SavedAddress[]) => {
      TestBed.inject(LoginService)['_applicationUser'].set({ id: 'u1', email: 'ivan@example.com' } as unknown as ApplicationUser);
      TestBed.tick();
      const req = httpMock.expectOne(addressesUrl());
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(addresses);
      fixture.detectChanges();
    };

    it('does not look up addresses or offer to save one for a guest', () => {
      fillCart();

      httpMock.expectNone(addressesUrl());
      expect(fixture.nativeElement.querySelector('.saved-address')).toBeNull();
      expect(fixture.nativeElement.textContent).not.toContain('Save this address to my account');
      flushQuotes(validQuote);
    });

    it('fills the form with the most recently used address', () => {
      fillCart();
      signIn([home, work]);

      expect(component.addressChoice.value).toBe('a1');
      expect(component.form.controls.streetAddress.value).toBe('bul. Vitosha 1');
      expect(component.form.controls.city.value).toBe('Sofia');
      expect(component.form.controls.firstName.value).toBe('Ivan');
      expect(fixture.nativeElement.querySelector('.saved-address')).toBeTruthy();
      // Already saved, so there is nothing to offer to save.
      expect(fixture.nativeElement.textContent).not.toContain('Save this address to my account');
      flushQuotes(validQuote);
    });

    it('does not replace an address the customer already started typing', () => {
      fillCart();
      component.form.controls.city.setValue('Varna');

      signIn([home]);

      expect(component.addressChoice.value).toBe('');
      expect(component.form.controls.city.value).toBe('Varna');
      flushQuotes(validQuote);
    });

    it('switches to another saved address, and clears the address for a new one', () => {
      fillCart();
      signIn([home, work]);

      component.addressChoice.setValue('a2');
      expect(component.form.controls.city.value).toBe('Plovdiv');
      expect(component.form.controls.postalCode.value).toBe('4000');

      component.addressChoice.setValue('');
      expect(component.form.controls.city.value).toBe('');
      expect(component.form.controls.streetAddress.value).toBe('');
      expect(component.form.controls.firstName.value).toBe('Ivan');
      flushQuotes(validQuote);
    });

    it('treats an edited saved address as a new one the customer can save', () => {
      fillCart();
      signIn([home]);

      component.form.controls.streetAddress.setValue('bul. Vitosha 2');
      fixture.detectChanges();

      expect(component.addressChoice.value).toBe('');
      expect(fixture.nativeElement.textContent).toContain('Save this address to my account');
      flushQuotes(validQuote);
    });

    it('asks to save a new address with the order when the customer ticks the box', () => {
      fillCart();
      signIn([]);
      fillForm();
      component.saveAddress.setValue(true);

      component.pay();

      const req = httpMock.expectOne(ordersUrl());
      expect(req.request.body.saveAddress).toBe(true);
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });
      flushQuotes(validQuote);
    });

    it('does not save a new address unless asked', () => {
      fillCart();
      signIn([]);
      fillForm();

      component.pay();

      const req = httpMock.expectOne(ordersUrl());
      expect(req.request.body.saveAddress).toBe(false);
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });
      flushQuotes(validQuote);
    });

    it('marks a saved address used for the order as the most recently used', () => {
      fillCart();
      signIn([work, home]);
      component.addressChoice.setValue('a2');
      component.form.patchValue({ email: 'ivan@example.com', acceptedTerms: true });

      component.pay();

      const req = httpMock.expectOne(ordersUrl());
      expect(req.request.body.saveAddress).toBe(true);
      expect(req.request.body.city).toBe('Plovdiv');
      req.flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/x', expiresOn: '' });
      flushQuotes(validQuote);
    });

    it('keeps the save choice out of the order fingerprint, so it does not count as changed details', () => {
      fillCart();
      signIn([]);
      fillForm();
      component.pay();
      httpMock.expectOne(ordersUrl()).flush({ orderId: 'o1', orderNumber: 'BG-1', total: 21, currency: 'EUR', checkoutUrl: 'https://checkout.revolut.com/first', expiresOn: '' });
      component.submitting.set(false);

      component.saveAddress.setValue(true);
      component.pay();

      // Same cart and details: the order already placed is resumed instead of being replaced.
      httpMock.expectOne(`${ordersUrl()}/o1`).flush({ id: 'o1', status: 0, canRetryPayment: false, checkoutUrl: 'https://checkout.revolut.com/first' });
      httpMock.expectNone(r => r.method === 'POST' && r.url === ordersUrl());
      flushQuotes(validQuote);
    });

    it('removes a saved address', () => {
      fillCart();
      signIn([home, work]);

      fixture.nativeElement.querySelector('.saved-address button[aria-label="Remove this saved address"]').click();

      const req = httpMock.expectOne(`${addressesUrl()}/a1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      expect(component.addresses()).toEqual([work]);
      expect(component.addressChoice.value).toBe('');
      flushQuotes(validQuote);
    });

    it('tells the customer when a saved address could not be removed', () => {
      fillCart();
      signIn([home]);

      component.removeAddress('a1');
      httpMock.expectOne(`${addressesUrl()}/a1`).flush('Boom', { status: 500, statusText: 'Server Error' });

      expect(component.addresses()).toEqual([home]);
      expect(component.problems()).toEqual(['The address could not be removed. Please try again.']);
      flushQuotes(validQuote);
    });

    it('lets the customer type an address when the address book cannot be loaded', () => {
      fillCart();
      TestBed.inject(LoginService)['_applicationUser'].set({ id: 'u1' } as unknown as ApplicationUser);
      TestBed.tick();
      httpMock.expectOne(addressesUrl()).flush('Boom', { status: 500, statusText: 'Server Error' });
      fixture.detectChanges();

      expect(component.addresses()).toEqual([]);
      expect(fixture.nativeElement.querySelector('#city')).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Save this address to my account');
      flushQuotes(validQuote);
    });
  });
});
