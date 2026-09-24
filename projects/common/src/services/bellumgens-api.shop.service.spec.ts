import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApiShopService, orderProblems } from './bellumgens-api.shop.service';
import { CommunicationService } from './communication.service';
import { DeliveryMethod, OrderRequest, OrderStatus } from '../models/shop';

describe('ApiShopService', () => {
  let service: ApiShopService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(ApiShopService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('caches the product list until refreshed', () => {
    service.products.subscribe();
    service.products.subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);

    service.refreshProducts();
    service.products.subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);
  });

  it('quotes a cart', () => {
    service.quote({ lines: [{ productId: 'p1', quantity: 2 }], promoCode: 'SAVE10', deliveryMethod: DeliveryMethod.Courier }).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/quote`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.lines[0].quantity).toBe(2);
    req.flush({});
  });

  it('creates an order with credentials so logged in customers are linked', () => {
    const order: OrderRequest = {
      lines: [{ productId: 'p1', quantity: 1 }],
      deliveryMethod: DeliveryMethod.Courier,
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      phoneNumber: '+359 1',
      city: 'Sofia',
      streetAddress: 'x',
      country: 'BG',
      language: 'bg',
      acceptedTerms: true
    };

    service.createOrder(order).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual(order);
    req.flush({});
  });

  it('reads and retries an order', () => {
    service.getOrder('o1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shop/orders/o1`).flush({});

    service.retryPayment('o1').subscribe();
    const retry = httpMock.expectOne(`${service['_apiEndpoint']}/shop/orders/o1/retry-payment`);
    expect(retry.request.method).toBe('POST');
    retry.flush({});
  });

  it('updates an order status through the admin API and reports success', () => {
    const messages: string[] = [];
    commsService.success.subscribe(message => messages.push(message));

    service.updateOrderStatus('o1', { status: OrderStatus.Shipped, trackingNumber: 'T1' }).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/orders/o1/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    expect(messages.length).toBe(1);
  });

  it('reports admin failures through the communication service', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));

    service.refundOrder('o1').subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/orders/o1/refund`)
      .flush('Only paid orders can be refunded.', { status: 400, statusText: 'Bad Request' });

    expect(errors).toEqual(['Only paid orders can be refunded.']);
  });

  it('posts and puts promo codes depending on whether they are new', () => {
    const promo = { code: 'SAVE10', discount: 0.1, active: true, timesUsed: 0 };

    service.savePromo(promo, true).subscribe();
    httpMock.expectOne(r => r.method === 'POST' && r.url === `${service['_apiEndpoint']}/shopadmin/promos`).flush(promo);

    service.savePromo(promo, false).subscribe();
    httpMock.expectOne(r => r.method === 'PUT' && r.url === `${service['_apiEndpoint']}/shopadmin/promos/SAVE10`).flush(promo);
  });

  describe('orderProblems', () => {
    it('extracts the problem list from a 409', () => {
      expect(orderProblems({ status: 409, error: { problems: ['Umbrella: Sold out.'] } })).toEqual(['Umbrella: Sold out.']);
    });

    it('falls back to a plain text body', () => {
      expect(orderProblems({ status: 503, error: 'Payments are temporarily unavailable.' })).toEqual(['Payments are temporarily unavailable.']);
    });

    it('returns nothing for unknown shapes', () => {
      expect(orderProblems({ status: 500, error: null })).toEqual([]);
    });
  });
});
