import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiShopService } from './bellumgens-api.shop.service';
import { JerseyCut, JerseyOrder, JerseySize, Promo } from '../models/jerseyorder';
import { CommunicationService } from './communication.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



describe('ApiShopService', () => {
  let service: ApiShopService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

  describe('submitOrder', () => {
    it('should send a POST request to the API with the order data', () => {
      const order: JerseyOrder = { jerseys: [{ cut: JerseyCut.Male, size: JerseySize.L }] };
      service.submitOrder(order).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/order`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(order);
      req.flush({});
    });
  });

  describe('deleteOrder', () => {
    it('should send a DELETE request to the API with the order ID', () => {
      const orderId = '123';
      commsService.success.subscribe(message => expect(message).toEqual('Order deleted successfully!'));
      service.deleteOrder(orderId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/order?orderId=${orderId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toEqual(true);
      req.flush({});

      const errorMessage = `Http failure response for ${service['_apiEndpoint']}/shop/order?orderId=${orderId}: 500 Could not delete order!`;
      commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
      service.deleteOrder(orderId).subscribe({
        next: () => fail('Should not succeed'),
        error: error => expect(error.message).toEqual(errorMessage)
      });
      const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/shop/order?orderId=${orderId}`);
      expect(req2.request.method).toBe('DELETE');
      expect(req2.request.withCredentials).toEqual(true);
      req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not delete order!' });
    });
  });

  describe('checkForPromo', () => {
    it('should send a GET request to the API with the promo code', () => {
      const code = 'SUMMER21';
      const promo: Promo = { code: code, discount: .1, expiration: new Date() };
      service.checkForPromo(code).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/promo?code=${code}`);
      expect(req.request.method).toBe('GET');
      req.flush(promo);
    });
  });

  describe('getOrders', () => {
    it('should send a GET request to the API to retrieve all orders', () => {
      service.getOrders().subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/orders`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toEqual(true);
      req.flush([]);
    });
  });

  describe('confirmOrder', () => {
    it('should send a PUT request to the API with the order data', () => {
      const order: JerseyOrder = { id: '123', jerseys: [{ cut: JerseyCut.Male, size: JerseySize.L }] };
      commsService.success.subscribe(message => expect(message).toEqual('Order confirmed successfully!'));
      service.confirmOrder(order).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/edit?orderId=${order.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(order);
      expect(req.request.withCredentials).toEqual(true);
      req.flush({});

      const errorMessage = `Http failure response for ${service['_apiEndpoint']}/shop/edit?orderId=${order.id}: 500 Could not confirm order!`;
      commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
      service.confirmOrder(order).subscribe({
        next: () => fail('Should not succeed'),
        error: error => expect(error.message).toEqual(errorMessage)
      });
      const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/shop/edit?orderId=${order.id}`);
      expect(req2.request.method).toBe('PUT');
      expect(req2.request.body).toEqual(order);
      expect(req2.request.withCredentials).toEqual(true);
      req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not confirm order!' });
    });
  });
});
