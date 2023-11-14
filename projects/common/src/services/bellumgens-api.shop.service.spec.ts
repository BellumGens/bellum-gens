import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiShopService } from './bellumgens-api.shop.service';
import { JerseyCut, JerseyOrder, JerseySize } from '../models/jerseyorder';



describe('ApiShopService', () => {
  let service: ApiShopService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiShopService ]
    });
    service = TestBed.inject(ApiShopService);
    httpMock = TestBed.inject(HttpTestingController);
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
      service.deleteOrder(orderId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/order?orderId=${orderId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toEqual(true);
      req.flush({});
    });
  });

  describe('checkForPromo', () => {
    it('should send a GET request to the API with the promo code', () => {
      const code = 'SUMMER21';
      service.checkForPromo(code).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/promo?code=${code}`);
      expect(req.request.method).toBe('GET');
      req.flush({});
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
      service.confirmOrder(order).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/shop/edit?orderId=${order.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(order);
      expect(req.request.withCredentials).toEqual(true);
      req.flush({});
    });
  });
});
