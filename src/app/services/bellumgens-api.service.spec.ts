import { TestBed, inject } from '@angular/core/testing';

import { BellumgensApiService } from './bellumgens-api.service';

describe('BellumgensApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BellumgensApiService]
    });
  });

  it('should be created', inject([BellumgensApiService], (service: BellumgensApiService) => {
    expect(service).toBeTruthy();
  }));
});
