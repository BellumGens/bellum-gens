import { TestBed, inject } from '@angular/core/testing';

import { BellumgensApiService } from './bellumgens-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BellumgensApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [BellumgensApiService]
    });
  });

  it('should be created', inject([BellumgensApiService], (service: BellumgensApiService) => {
    expect(service).toBeTruthy();
  }));
});
