import { TestBed } from '@angular/core/testing';

import { ApiShopService } from './bellumgens-api.shop.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BellumgensApi.ShopService', () => {
  let service: ApiShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ApiShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
