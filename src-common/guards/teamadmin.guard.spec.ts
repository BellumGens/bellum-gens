import { TestBed, inject } from '@angular/core/testing';

import { TeamadminGuard } from './teamadmin.guard';

describe('TeamadminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamadminGuard]
    });
  });

  it('should ...', inject([TeamadminGuard], (guard: TeamadminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
