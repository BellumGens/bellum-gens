import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
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

  it('keeps the page when the order cannot be loaded for another reason', () => {
    httpMock.expectOne(orderUrl()).flush('', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.notFound()).toBe(false);
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

  it('empties the cart once the order is paid', () => {
    const cart = TestBed.inject(CartService);
    cart['_items'].set([{ productId: 'p1', quantity: 1, product: {} as never }]);

    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));

    expect(cart.isEmpty()).toBe(true);
  });

  it('shows the tracking number of a shipped order', () => {
    httpMock.expectOne(orderUrl()).flush({ ...order(OrderStatus.Shipped, PaymentStatus.Completed), trackingNumber: 'SPD-123' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('SPD-123');
    expect(fixture.nativeElement.textContent).toContain('on its way');
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
