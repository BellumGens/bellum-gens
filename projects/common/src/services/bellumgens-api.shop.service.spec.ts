import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApiShopService, orderProblems } from './bellumgens-api.shop.service';
import { CommunicationService } from './communication.service';
import { Brand, DeliveryMethod, OrderRequest, OrderStatus, Product, ProductType } from '../models/shop';

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

  describe('products', () => {
    const jersey = { id: 'jersey', name: 'Jersey' } as Product;

    it('loads the products on first read and keeps them', () => {
      const products = service.products;
      expect(products()).toBeNull();
      // A second read while the request is in flight does not ask again
      expect(service.products).toBe(products);

      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([jersey]);
      expect(products()).toEqual([jersey]);

      service.products;
      httpMock.expectNone(`${service['_apiEndpoint']}/shop/products`);
    });

    it('reloads the products when the catalog changes', () => {
      const products = service.products;
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);

      service.refreshProducts();
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([jersey]);

      expect(products()).toEqual([jersey]);
    });

    it('does not load the products on a catalog change when nothing has read them', () => {
      service.refreshProducts();

      httpMock.expectNone(`${service['_apiEndpoint']}/shop/products`);
    });

    it('shows no products and tries again on the next read when loading fails', () => {
      const errors: string[] = [];
      commsService.error.subscribe(message => errors.push(message));

      const products = service.products;
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`)
        .flush('error', { status: 500, statusText: 'Server Error' });

      expect(products()).toEqual([]);
      expect(errors.length).toBe(1);

      service.products;
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([jersey]);
      expect(products()).toEqual([jersey]);
    });
  });

  it('filters products by brand and type only when they are given', () => {
    service.getProducts().subscribe();
    expect(httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).request.params.keys()).toEqual([]);

    service.getProducts(Brand.EBLeague, ProductType.Jersey).subscribe();
    const req = httpMock.expectOne(r => r.url === `${service['_apiEndpoint']}/shop/products` && r.params.has('brand'));
    expect(req.request.params.get('brand')).toBe(`${Brand.EBLeague}`);
    expect(req.request.params.get('type')).toBe(`${ProductType.Jersey}`);
    req.flush([]);
  });

  it('reads a product by its encoded slug and checks a promo code', () => {
    service.getProduct('ebl jersey').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shop/products/ebl%20jersey`).flush({});

    service.checkPromo('SAVE10').subscribe();
    const req = httpMock.expectOne(r => r.url === `${service['_apiEndpoint']}/shop/promo`);
    expect(req.request.params.get('code')).toBe('SAVE10');
    req.flush({});
  });

  it('lists the orders of the signed in customer', () => {
    service.getMyOrders().subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/orders/mine`);
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });

  describe('catalog administration', () => {
    const product = { id: 'jersey', name: 'Jersey' } as Product;
    let messages: string[];
    let errors: string[];

    beforeEach(() => {
      messages = [];
      errors = [];
      commsService.success.subscribe(message => messages.push(message));
      commsService.error.subscribe(message => errors.push(message));
      // The storefront has read the products, so catalog changes reload them
      service.products;
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);
    });

    it('lists every product, including inactive ones', () => {
      service.getAdminProducts().subscribe();

      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products`);
      expect(req.request.withCredentials).toBe(true);
      req.flush([]);
    });

    it('creates a new product and updates an existing one, reloading the storefront', () => {
      service.saveProduct({ ...product, id: '' }).subscribe();
      httpMock.expectOne(r => r.method === 'POST' && r.url === `${service['_apiEndpoint']}/shopadmin/products`).flush(product);
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([product]);

      service.saveProduct(product).subscribe();
      httpMock.expectOne(r => r.method === 'PUT' && r.url === `${service['_apiEndpoint']}/shopadmin/products/jersey`).flush(product);
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([product]);

      expect(messages).toEqual(['Product saved!', 'Product saved!']);
    });

    it('reports whether a product was deleted or only deactivated', () => {
      service.deleteProduct('jersey').subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products/jersey`).flush({ id: 'jersey', deactivated: false });
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);

      service.deleteProduct('jersey').subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products/jersey`).flush({ id: 'jersey', deactivated: true });
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);

      expect(messages).toEqual(['Product deleted!', 'The product has orders, so it was deactivated instead of deleted.']);
    });

    it('uploads a product image and reports a failed upload', () => {
      let url: string;
      service.uploadProductImage('jersey', 'data:image/png;base64,AAA').subscribe(result => url = result.url);
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products/jersey/image`);
      expect(req.request.body).toEqual({ image: 'data:image/png;base64,AAA' });
      req.flush({ url: 'https://cdn/jersey.png' });
      httpMock.expectOne(`${service['_apiEndpoint']}/shop/products`).flush([]);
      expect(url).toBe('https://cdn/jersey.png');

      service.uploadProductImage('jersey', 'data:image/png;base64,AAA').subscribe({ error: () => undefined });
      httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products/jersey/image`)
        .flush('Only PNG images are supported.', { status: 400, statusText: 'Bad Request' });

      expect(errors).toEqual(['Only PNG images are supported.']);
    });

    it('reports failed product changes with the server message', () => {
      service.saveProduct(product).subscribe({ error: () => undefined });
      httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products/jersey`).flush('', { status: 500, statusText: 'Server Error' });

      service.deleteProduct('jersey').subscribe({ error: () => undefined });
      httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/products/jersey`).flush('Not found', { status: 404, statusText: 'Not Found' });

      // An empty body falls back to the HTTP error message
      expect(errors.length).toBe(2);
      expect(errors[0]).toContain('500 Server Error');
      expect(errors[1]).toBe('Not found');
    });
  });

  it('lists the admin orders, optionally by status', () => {
    service.getAdminOrders().subscribe();
    expect(httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/orders`).request.params.keys()).toEqual([]);

    service.getAdminOrders(OrderStatus.Paid).subscribe();
    const req = httpMock.expectOne(r => r.url === `${service['_apiEndpoint']}/shopadmin/orders` && r.params.has('status'));
    expect(req.request.params.get('status')).toBe(`${OrderStatus.Paid}`);
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });

  it('reports a failed order status update', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));

    service.updateOrderStatus('o1', { status: OrderStatus.Shipped }).subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/orders/o1/status`)
      .flush('A tracking number is required.', { status: 400, statusText: 'Bad Request' });

    expect(errors).toEqual(['A tracking number is required.']);
  });

  it('refunds an order and reports success', () => {
    const messages: string[] = [];
    commsService.success.subscribe(message => messages.push(message));

    service.refundOrder('o1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/orders/o1/refund`).flush({});

    expect(messages).toEqual(['Refund sent to the payment provider.']);
  });

  it('links to the order export', () => {
    expect(service.ordersExportUrl).toBe(`${service['_apiEndpoint']}/shopadmin/orders/export.csv`);
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

  it('reports whether a promo code was deleted or only deactivated, and failures', () => {
    const messages: string[] = [];
    const errors: string[] = [];
    commsService.success.subscribe(message => messages.push(message));
    commsService.error.subscribe(message => errors.push(message));

    service.deletePromo('SAVE 10').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/promos/SAVE%2010`).flush({ code: 'SAVE 10', deactivated: false });
    service.deletePromo('SAVE10').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/promos/SAVE10`).flush({ code: 'SAVE10', deactivated: true });
    service.deletePromo('SAVE10').subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/promos/SAVE10`).flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(messages).toEqual(['Promo code deleted!', 'The code was used by orders, so it was deactivated instead of deleted.']);
    expect(errors).toEqual(['Not found']);
  });

  it('reports a failed promo code save', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));

    service.savePromo({ code: 'SAVE10', discount: 0.1, active: true, timesUsed: 0 }, true).subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/promos`).flush('The code exists.', { status: 409, statusText: 'Conflict' });

    expect(errors).toEqual(['The code exists.']);
  });

  it('registers the payment webhook and reports a failure', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));

    service.registerWebhook('https://api/webhook').subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/payments/webhook`);
    expect(req.request.body).toEqual({ url: 'https://api/webhook' });
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    service.registerWebhook('https://api/webhook').subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/shopadmin/payments/webhook`)
      .flush('Revolut rejected the URL.', { status: 502, statusText: 'Bad Gateway' });

    expect(errors).toEqual(['Revolut rejected the URL.']);
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
