import { TestBed } from '@angular/core/testing';

import { BellumgensApiService } from './bellumgens-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BellumgensApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', () => {
    const service: BellumgensApiService = TestBed.inject(BellumgensApiService);
    expect(service).toBeTruthy();
  });
});
