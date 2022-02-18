import { TestBed, inject } from '@angular/core/testing';

import { TeamadminGuard } from './teamadmin.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamadminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamadminGuard],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false})
      ]
    });
  });

  it('should ...', inject([TeamadminGuard], (guard: TeamadminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
