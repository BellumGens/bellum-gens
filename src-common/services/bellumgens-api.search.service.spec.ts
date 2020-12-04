import { TestBed } from '@angular/core/testing';

import { ApiSearchService } from './bellumgens-api.search.service';

describe('BellumgensApi.SearchService', () => {
  let service: ApiSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
