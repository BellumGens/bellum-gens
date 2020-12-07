import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiSearchService } from './bellumgens-api.search.service';

describe('ApiSearchService', () => {
  let service: ApiSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ApiSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
