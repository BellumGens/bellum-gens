import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ApiShopService, LoginService } from 'bellum-gens-common/services';
import {
  ApplicationUser,
  DeliveryMethod,
  OrderStatus,
  OrderStatusView,
  PaymentMethod
} from 'bellum-gens-common/models';
import { OrderHistoryComponent } from './order-history.component';

const order = (id: string, orderNumber: string, orderDate: string, status: OrderStatus, overrides: Partial<OrderStatusView> = {}): OrderStatusView => ({
  id,
  orderNumber,
  status,
  items: [{ productId: 'p1', productName: 'Jersey', variantName: 'M', unitPrice: 30, quantity: 2, lineTotal: 60 }],
  subtotal: 60,
  discountTotal: 0,
  shippingCost: 0,
  total: 60,
  currency: 'EUR',
  email: 'ivan@example.com',
  firstName: 'Ivan',
  lastName: 'Petrov',
  phoneNumber: '+359 888 123 456',
  city: 'Sofia',
  streetAddress: 'bul. Vitosha 1',
  postalCode: '1000',
  country: 'BG',
  deliveryMethod: DeliveryMethod.Courier,
  paymentMethod: PaymentMethod.Revolut,
  orderDate,
  expiresOn: orderDate,
  canRetryPayment: false,
  ...overrides
});

const older = order('o1', 'BG-1', '2026-09-01T10:00:00Z', OrderStatus.Delivered, {
  items: [
    { productId: 'p1', productName: 'Jersey', variantName: 'M', unitPrice: 30, quantity: 2, lineTotal: 60 },
    { productId: 'p2', productName: 'Pen', unitPrice: 2, quantity: 1, lineTotal: 2 }
  ],
  total: 62
});
const newer = order('o2', 'BG-2', '2026-10-15T10:00:00Z', OrderStatus.AwaitingPayment);

describe('OrderHistoryComponent', () => {
  let fixture: ComponentFixture<OrderHistoryComponent>;
  let component: OrderHistoryComponent;
  let httpMock: HttpTestingController;
  let login: LoginService;
  let api: ApiShopService;

  const element = () => fixture.nativeElement as HTMLElement;
  const ordersUrl = () => `${api['_apiEndpoint']}/shop/orders/mine`;
  const signIn = (id = 'u1') => {
    login['_applicationUser'].set({ id, email: 'ivan@example.com' } as ApplicationUser);
    fixture.detectChanges();
  };
  const render = () => {
    fixture.detectChanges();
    return element();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // LoginService depends on SwPush, so the service worker module is registered disabled.
      imports: [OrderHistoryComponent, NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false })],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    login = TestBed.inject(LoginService);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** LoginService checks for a signed in user on first access; answer as a guest. */
  const answerAsGuest = () => {
    httpMock.match(request => request.url.includes('/api/account')).forEach(request => request.flush(null));
    fixture.detectChanges();
  };

  it('shows a labelled progress indicator while checking for a signed in user', () => {
    const progress = element().querySelector('igx-circular-bar');
    expect(progress?.getAttribute('aria-label')).toBe('Loading your orders');
    answerAsGuest();
  });

  describe('for a guest', () => {
    beforeEach(answerAsGuest);

    it('asks to sign in instead of loading orders', () => {
      httpMock.expectNone(ordersUrl());
      expect(element().textContent).toContain('Sign in to see the orders you placed from your account.');
    });

    it('opens the login dialog from the sign in button', () => {
      const opened = vi.fn();
      login.openLogin.subscribe(opened);

      const button = Array.from(element().querySelectorAll('button')).find(b => b.textContent?.includes('Sign in'));
      button!.click();

      expect(opened).toHaveBeenCalled();
    });

    it('loads the orders once the user signs in', () => {
      signIn();

      httpMock.expectOne(ordersUrl()).flush([older]);
      expect(render().textContent).toContain('Order BG-1');
    });
  });

  describe('for a signed in user', () => {
    beforeEach(() => {
      answerAsGuest();
      signIn();
    });

    it('asks for the orders with the session cookie', () => {
      const request = httpMock.expectOne(ordersUrl());
      expect(request.request.method).toBe('GET');
      expect(request.request.withCredentials).toBe(true);
      request.flush([]);
    });

    it('shows a progress indicator until the orders arrive', () => {
      expect(element().querySelector('igx-circular-bar')).toBeTruthy();
      httpMock.expectOne(ordersUrl()).flush([]);
      expect(render().querySelector('igx-circular-bar')).toBeNull();
    });

    it('lists the most recent order first, each linking to its status page', () => {
      httpMock.expectOne(ordersUrl()).flush([older, newer]);

      const links = Array.from(render().querySelectorAll<HTMLAnchorElement>('a.order-link'));
      expect(links.map(link => link.textContent?.trim())).toEqual(['Order BG-2', 'Order BG-1']);
      expect(links.map(link => link.getAttribute('href'))).toEqual(['/shop/order/o2', '/shop/order/o1']);
    });

    it('shows the status, the total and what was ordered', () => {
      httpMock.expectOne(ordersUrl()).flush([older]);

      const row = render().querySelector('igx-list-item')!;
      expect(row.textContent).toContain('Delivered');
      expect(row.textContent).toContain('€62.00');
      expect(row.querySelector('.order-summary')?.textContent).toContain('2 × Jersey (M), 1 × Pen');
      const icon = row.querySelector('.status-icon')!;
      expect(icon.textContent?.trim()).toBe('inventory_2');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('points to the shop when there are no orders yet', () => {
      httpMock.expectOne(ordersUrl()).flush([]);

      expect(render().textContent).toContain('You have not placed any orders yet.');
      const shopLink = Array.from(element().querySelectorAll('a')).find(a => a.textContent?.includes('Browse the shop'));
      expect(shopLink?.getAttribute('href')).toBe('/shop');
    });

    it('reports a failed load and tries again on request', () => {
      httpMock.expectOne(ordersUrl()).flush('', { status: 500, statusText: 'Server Error' });

      const alert = render().querySelector('[role="alert"]');
      expect(alert?.textContent).toContain('We could not load your orders right now.');

      alert!.querySelector('button')!.click();
      httpMock.expectOne(ordersUrl()).flush([newer]);
      expect(render().querySelector('[role="alert"]')).toBeNull();
      expect(element().textContent).toContain('Order BG-2');
    });

    it('forgets the orders on sign out', () => {
      httpMock.expectOne(ordersUrl()).flush([older]);
      render();

      login['_applicationUser'].set(null);
      // Signing out leaves the cached user empty, which makes LoginService check again; answer as a guest.
      render();
      answerAsGuest();

      expect(element().querySelector('a.order-link')).toBeNull();
      expect(element().textContent).toContain('Sign in to see the orders you placed from your account.');
    });

    it('loads the orders of another user who signs in, ignoring the previous answer', () => {
      const first = httpMock.expectOne(ordersUrl());

      signIn('u2');
      expect(first.cancelled).toBe(true);
      httpMock.expectOne(ordersUrl()).flush([newer]);

      expect(render().textContent).toContain('Order BG-2');
    });

    it('does not reload when the same user is updated', () => {
      httpMock.expectOne(ordersUrl()).flush([older]);

      signIn('u1');

      httpMock.expectNone(ordersUrl());
      expect(component.orders()?.length).toBe(1);
    });
  });
});
