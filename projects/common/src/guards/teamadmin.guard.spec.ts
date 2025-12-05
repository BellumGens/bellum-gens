import { TestBed, inject } from '@angular/core/testing';

import { TeamadminGuard } from './teamadmin.guard';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamadminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
      ServiceWorkerModule.register('', { enabled: false })
    ],
    providers: [TeamadminGuard, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should ...', inject([TeamadminGuard], (guard: TeamadminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
