import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OrderStatusComponent } from './order-status.component';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
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
    fixture.destroy();
    httpMock.verify();
  });

  it('loads the order from the route and stops polling once it is paid', fakeAsync(() => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(component.order()?.status).toBe(OrderStatus.Paid);
    expect(component.polling()).toBe(false);

    tick(OrderStatusComponent.pollIntervalMs + 10);
    httpMock.expectNone(orderUrl());
  }));

  it('keeps polling while the payment is pending, then stops when it completes', fakeAsync(() => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));
    fixture.detectChanges();
    expect(component.polling()).toBe(true);
    expect(component.paymentPending).toBe(true);

    tick(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Pending));

    tick(OrderStatusComponent.pollIntervalMs);
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));
    fixture.detectChanges();

    expect(component.polling()).toBe(false);
    tick(OrderStatusComponent.pollIntervalMs + 10);
    httpMock.expectNone(orderUrl());
  }));

  it('offers a retry after a declined payment without polling', fakeAsync(() => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.AwaitingPayment, PaymentStatus.Failed));
    fixture.detectChanges();

    expect(component.polling()).toBe(false);
    expect(component.order()?.canRetryPayment).toBe(true);
    tick(OrderStatusComponent.pollIntervalMs + 10);
    httpMock.expectNone(orderUrl());
  }));

  it('shows the not found state for an unknown order', fakeAsync(() => {
    httpMock.expectOne(orderUrl()).flush('', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component.notFound()).toBe(true);
    expect(component.order()).toBeNull();
  }));

  it('picks an icon per status', () => {
    httpMock.expectOne(orderUrl()).flush(order(OrderStatus.Paid, PaymentStatus.Completed));

    expect(component.statusIcon(OrderStatus.Paid)).toBe('check_circle');
    expect(component.statusIcon(OrderStatus.Shipped)).toBe('local_shipping');
    expect(component.statusIcon(OrderStatus.Cancelled)).toBe('cancel');
    expect(component.statusIcon(OrderStatus.AwaitingPayment)).toBe('hourglass_top');
  });
});
