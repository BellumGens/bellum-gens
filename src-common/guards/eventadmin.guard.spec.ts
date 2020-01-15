import { TestBed, inject } from '@angular/core/testing';

import { EventAdminGuard } from './eventadmin.guard';

describe('EventadminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventAdminGuard]
    });
  });

  it('should ...', inject([EventAdminGuard], (guard: EventAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
