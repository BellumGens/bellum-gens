import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { OrderStatusComponent } from './order-status.component';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { CartService } from '../../../services/cart.service';
import { DeliveryMethod, OrderStatus, OrderStatusView, PaymentStatus } from '../../../models/shop';

const order = (status: OrderStatus, paymentStatus: PaymentStatus | null): OrderStatusView => ({
  id: 'o1',
  orderNumber: 'BG-2026-000001',
  status,
  paymentStatus,
  items: [{ productId: 'p1', productName: 'Umbrella', unitPrice: 15, quantity: 1, lineTotal: 15 }],
  subtotal: 15,
  discountTotal: 0,
  shippingCost: 6,
  total: 21,
  currency: 'EUR',
  email: 'ivan@example.com',
  firstName: 'Ivan',
  lastName: 'Petrov',
  phoneNumber: '+359 888',
  city: 'Sofia',
  streetAddress: 'bul. Vitosha 1',
  country: 'BG',
  deliveryMethod: DeliveryMethod.Courier,
  orderDate: '2026-09-04T10:00:00Z',
  expiresOn: '2026-09-04T11:00:00Z',
  checkoutUrl: status === OrderStatus.AwaitingPayment ? 'https://checkout.revolut.com/x' : null,
  canRetryPayment: status === OrderStatus.AwaitingPayment && paymentStatus === PaymentStatus.Failed
});

describe('OrderStatusComponent', () => {
  let fixture: ComponentFixture<OrderStatusComponent>;
  let component: OrderStatusComponent;
  let httpMock: HttpTestingController;
  let api: ApiShopService;
  const orderUrl = () => `${api['_apiEndpoint']}/shop/orders/o1`;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
    await TestBed.configureTestingModule({
      imports: [OrderStatusComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: 'o1' })) } }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(OrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    fixture.destroy();
    httpMock.verify();
  });

  it('loads the order from the route and stops polling once it is paid', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(component.order()?.status).toBe(OrderStatus.Paid);
    expect(component.polling()).toBe(false);

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs + 10);
    httpMock.expectNone(orderUrl());
  });

  it('keeps polling while the payment is pending, then stops when it completes', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    fixture.detectChanges();
    expect(component.polling()).toBe(true);
    expect(component.paymentPending()).toBe(true);

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(component.polling()).toBe(false);
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs + 10);
    httpMock.expectNone(orderUrl());
  });

  it('offers a retry after a declined payment without polling', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));
    fixture.detectChanges();

    expect(component.polling()).toBe(false);
    expect(component.order()?.canRetryPayment).toBe(true);
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs + 10);
    httpMock.expectNone(orderUrl());
  });

  it('shows the not found state for an unknown order', () => {
    httpMock.expectOne(orderUrl()).flush('', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component.notFound()).toBe(true);
    expect(component.order()).toBeNull();
  });

  it('offers a retry when the order cannot be loaded for another reason', () => {
    httpMock.expectOne(orderUrl()).flush('', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.notFound()).toBe(false);
    expect(component.loadFailed()).toBe(true);
    expect(component.polling()).toBe(false);
    expect(fixture.nativeElement.querySelector('igx-circular-bar')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('could not load this order');

    (fixture.nativeElement.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    expect(component.loadFailed()).toBe(false);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(component.order()?.status).toBe(OrderStatus.Paid);
  });

  it('keeps polling through a failed request while the payment is pending', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush('', { status: 502, statusText: 'Bad Gateway' });

    expect(component.loadFailed()).toBe(false);
    expect(component.order()?.status).toBe(OrderStatus.AwaitingPayment);
    expect(component.polling()).toBe(true);

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    expect(component.polling()).toBe(false);
  });

  it('picks an icon per status', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));

    expect(component.statusIcon(OrderStatus.Paid)).toBe('check_circle');
    expect(component.statusIcon(OrderStatus.Shipped)).toBe('local_shipping');
    expect(component.statusIcon(OrderStatus.Delivered)).toBe('inventory_2');
    expect(component.statusIcon(OrderStatus.Cancelled)).toBe('cancel');
    expect(component.statusIcon(OrderStatus.Refunded)).toBe('undo');
    expect(component.statusIcon(OrderStatus.AwaitingPayment)).toBe('hourglass_top');
  });

  it('sends the customer back to the checkout that is still open', () => {
    const assign = vi.fn();
    // The component leaves the page through document.location, which jsdom does not allow spying on.
    component['document'] = { location: { assign } } as unknown as Document;
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));

    component.payNow();

    expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/x');
    fixture.destroy();
  });

  it('does nothing when there is no checkout to return to', () => {
    const assign = vi.fn();
    component['document'] = { location: { assign } } as unknown as Document;
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Cancelled, PaymentStatus.Cancelled));

    component.payNow();

    expect(assign).not.toHaveBeenCalled();
  });

  it('starts a fresh payment when the customer retries', () => {
    const assign = vi.fn();
    component['document'] = { location: { assign } } as unknown as Document;
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));

    component.retryPayment();

    const retry = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders/o1/retry-payment`);
    expect(retry.request.method).toBe('POST');
    retry.flush({
      orderId: 'o1',
      orderNumber: 'BG-2026-000001',
      total: 21,
      currency: 'EUR',
      checkoutUrl: 'https://checkout.revolut.com/retry',
      expiresOn: '2026-09-04T11:00:00Z'
    });

    expect(assign).toHaveBeenCalledWith('https://checkout.revolut.com/retry');
  });

  it('recovers and reloads the order when the retry cannot be started', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));

    component.retryPayment();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders/o1/retry-payment`)
      .flush('', { status: 502, statusText: 'Bad Gateway' });
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));

    expect(component.busy()).toBe(false);
    expect(component.order()?.canRetryPayment).toBe(true);
  });

  it('cancels a pending retry when the customer leaves the page', () => {
    const assign = vi.fn();
    component['document'] = { location: { assign } } as unknown as Document;
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));

    component.retryPayment();
    const retry = httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders/o1/retry-payment`);
    fixture.destroy();

    expect(retry.cancelled).toBe(true);
    expect(assign).not.toHaveBeenCalled();
  });

  it('gives up polling after the timeout and explains the wait', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    expect(component.polling()).toBe(true);

    // Pretend the page has been waiting past the polling window instead of ticking through it.
    component['pollStarted'] = Date.now() - (OrderStatusComponent.pollTimeoutMs + 1000);
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    fixture.detectChanges();

    expect(component.polling()).toBe(false);
    expect(component.timedOut()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('has not been confirmed yet');
  });

  it('stops waiting when a status request stalls past the polling window', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    component['pollStarted'] = Date.now() - (OrderStatusComponent.pollTimeoutMs - 10000);

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    const stalled = httpMock.expectOne(orderUrl());
    expect(component.polling()).toBe(true);

    vi.advanceTimersByTime(10000);
    fixture.detectChanges();

    expect(stalled.cancelled).toBe(true);
    expect(component.polling()).toBe(false);
    expect(component.timedOut()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('has not been confirmed yet');
  });

  it('shows the initial load as failed soon after the first request stalls', () => {
    const stalled = httpMock.expectOne(orderUrl());

    vi.advanceTimersByTime(OrderStatusComponent.requestTimeoutMs - 1);
    expect(component.loadFailed()).toBe(false);
    vi.advanceTimersByTime(1);
    fixture.detectChanges();

    expect(stalled.cancelled).toBe(true);
    expect(component.loadFailed()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });

  it('retries a poll that stalls while the polling window is still open', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));

    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    const stalled = httpMock.expectOne(orderUrl());
    vi.advanceTimersByTime(OrderStatusComponent.requestTimeoutMs);

    expect(stalled.cancelled).toBe(true);
    expect(component.polling()).toBe(true);
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    expect(component.polling()).toBe(false);
  });

  it('gives the reload after a failed retry a fresh time limit, however long the page has been open', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));
    component['pollStarted'] = Date.now() - (OrderStatusComponent.pollTimeoutMs + 60000);

    component.retryPayment();
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/orders/o1/retry-payment`)
      .flush('', { status: 502, statusText: 'Bad Gateway' });
    const reload = httpMock.expectOne(orderUrl());
    // Slower than a poll interval, well within the request limit.
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs + 1000);

    expect(reload.cancelled).toBe(false);
    reload.flush(order(OrderStatus.Cancelled, PaymentStatus.Failed));
    expect(component.order()?.status).toBe(OrderStatus.Cancelled);
    expect(component.loadFailed()).toBe(false);
  });

  it('tells the customer when refreshing an order on screen fails', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));

    component.refresh();
    httpMock.expectOne(orderUrl()).flush('', { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();

    expect(component.loadFailed()).toBe(true);
    expect(component.order()).not.toBeNull();
    const alert: HTMLElement = fixture.nativeElement.querySelector('.status-message [role="alert"]');
    expect(alert.textContent).toContain('could not refresh the status');

    component.refresh();
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-message [role="alert"]')).toBeNull();
  });

  it('treats a link the API refuses to resolve as a missing order', () => {
    httpMock.expectOne(orderUrl()).flush('', { status: 401, statusText: 'Unauthorized' });

    expect(component.notFound()).toBe(true);
    expect(component.loadFailed()).toBe(false);
  });

  it('announces the payment message when polling gives up', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    fixture.detectChanges();
    const region: HTMLElement = fixture.nativeElement.querySelector('.status-message [aria-live="polite"]');
    expect(region.textContent).toContain('waiting for the payment confirmation');

    component['pollStarted'] = Date.now() - OrderStatusComponent.pollTimeoutMs;
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    fixture.detectChanges();

    // Same live element, new text: assistive technology announces the change.
    expect(fixture.nativeElement.querySelector('.status-message [aria-live="polite"]')).toBe(region);
    expect(region.textContent).toContain('has not been confirmed yet');
  });

  it('announces status changes through a polite live region', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    fixture.detectChanges();

    const region: HTMLElement = fixture.nativeElement.querySelector('.status-header [aria-live]');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.querySelector('h2')).not.toBeNull();
  });

  it('polls again when the customer refreshes by hand', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    component['pollStarted'] = Date.now() - (OrderStatusComponent.pollTimeoutMs + 1000);
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    expect(component.timedOut()).toBe(true);

    component.refresh();

    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    expect(component.timedOut()).toBe(false);
    expect(component.order()?.status).toBe(OrderStatus.Paid);
  });

  it('stops polling once the page is left', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    expect(component.polling()).toBe(true);

    fixture.destroy();
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs * 3);

    httpMock.expectNone(orderUrl());
  });

  it('cancels a request still in flight when the page is left', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs);
    const inFlight = httpMock.expectOne(orderUrl());

    fixture.destroy();

    expect(inFlight.cancelled).toBe(true);
    vi.advanceTimersByTime(OrderStatusComponent.pollIntervalMs * 3);
    httpMock.expectNone(orderUrl());
  });

  it('leaves the current cart alone when viewing a paid order', () => {
    const cart = TestBed.inject(CartService);
    cart['_items'].set([{ productId: 'p1', quantity: 1, product: {} as never }]);

    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));

    expect(cart.isEmpty()).toBe(false);
  });

  it('shows the tracking number of a shipped order', () => {
    httpMock.expectOne(orderUrl()).flush({ ...order(OrderStatus.Shipped, PaymentStatus.Completed), trackingNumber: 'SPD-123' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('SPD-123');
    expect(fixture.nativeElement.textContent).toContain('on its way');
  });

  it('tells a customer who picks up at an event what happens next', () => {
    httpMock.expectOne(orderUrl()).flush({ ...order(OrderStatus.Paid, PaymentStatus.Completed), deliveryMethod: DeliveryMethod.EventPickup });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('collect your order at our next event');
    expect(fixture.nativeElement.textContent).not.toContain('handed to the courier');
  });

  it('shows a shipped order without a tracking number yet', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Shipped, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('on its way');
    expect(fixture.nativeElement.textContent).not.toContain('Tracking number');
  });

  it('lists the chosen options, the discount with its promo code and free shipping', () => {
    httpMock.expectOne(orderUrl()).flush({
      ...order(OrderStatus.Paid, PaymentStatus.Completed),
      items: [{ productId: 'p1', variantId: 'v1', productName: 'Jersey', variantName: 'Male / L', unitPrice: 30, quantity: 1, lineTotal: 30 }],
      subtotal: 30,
      discountTotal: 3,
      promoCode: 'SAVE10',
      shippingCost: 0,
      total: 27
    });
    fixture.detectChanges();

    const items: HTMLElement = fixture.nativeElement.querySelector('.order-items');
    expect(items.querySelector('.line-variant').textContent).toContain('(Male / L)');
    expect(items.textContent).toContain('(SAVE10)');
    expect(items.textContent).toContain('Free');
  });

  it('shows a discount that came without a promo code', () => {
    httpMock.expectOne(orderUrl()).flush({ ...order(OrderStatus.Paid, PaymentStatus.Completed), discountTotal: 2, total: 19 });
    fixture.detectChanges();

    const discount = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.order-items dt')).find(dt => dt.textContent.includes('Discount'));
    expect(discount.textContent.trim()).toBe('Discount');
  });

  it('reports a cancelled order without charging anything', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Cancelled, PaymentStatus.Cancelled));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('nothing was charged');
  });

  it('reports a refunded order', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Refunded, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('was refunded');
  });
});

describe('OrderStatusComponent without an order id', () => {
  it('shows the not found state without asking the API', async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } }
      ]
    }).compileComponents();
    const httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(OrderStatusComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.notFound()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('could not find this order');
    httpMock.verify();
  });
});

describe('OrderStatusComponent when the order changes', () => {
  let fixture: ComponentFixture<OrderStatusComponent>;
  let component: OrderStatusComponent;
  let httpMock: HttpTestingController;
  let endpoint: string;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
    params = new BehaviorSubject(convertToParamMap({ id: 'o1' }));
    await TestBed.configureTestingModule({
      imports: [OrderStatusComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params } }
      ]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    endpoint = TestBed.inject(ApiShopService)['_apiEndpoint'];
    fixture = TestBed.createComponent(OrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    fixture.destroy();
    httpMock.verify();
  });

  it('cancels the retry for the previous order and clears its busy state', () => {
    const assign = vi.fn();
    component['document'] = { location: { assign } } as unknown as Document;
    httpMock.expectOne(`${endpoint}/shop/orders/o1`).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));
    component.retryPayment();
    const retry = httpMock.expectOne(`${endpoint}/shop/orders/o1/retry-payment`);
    expect(component.busy()).toBe(true);

    params.next(convertToParamMap({ id: 'o2' }));

    expect(retry.cancelled).toBe(true);
    expect(component.busy()).toBe(false);
    httpMock.expectOne(`${endpoint}/shop/orders/o2`).flush({ ...order(OrderStatus.Paid, PaymentStatus.Completed), id: 'o2' });
    expect(assign).not.toHaveBeenCalled();
  });

  it('does not keep reporting a missing order after moving to another one', () => {
    httpMock.expectOne(`${endpoint}/shop/orders/o1`).flush('', { status: 404, statusText: 'Not Found' });
    expect(component.notFound()).toBe(true);

    params.next(convertToParamMap({ id: 'o2' }));
    httpMock.expectOne(`${endpoint}/shop/orders/o2`).flush('', { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();

    expect(component.notFound()).toBe(false);
    expect(component.loadFailed()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });
});
