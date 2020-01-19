import { TestBed, inject } from '@angular/core/testing';

import { EventAdminGuard } from './eventadmin.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventadminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventAdminGuard],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false})
      ]
    });
  });

  it('should ...', inject([EventAdminGuard], (guard: EventAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
