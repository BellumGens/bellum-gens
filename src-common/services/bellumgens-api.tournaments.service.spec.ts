import { TestBed } from '@angular/core/testing';

import { ApiTournamentsService } from './bellumgens-api.tournaments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApiTournamentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: ApiTournamentsService = TestBed.inject(ApiTournamentsService);
    expect(service).toBeTruthy();
  });
});
