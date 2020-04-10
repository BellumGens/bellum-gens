import { TestBed } from '@angular/core/testing';

import { ApiShopService } from './bellumgens-api.shop.service';

describe('BellumgensApi.ShopService', () => {
  let service: ApiShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
