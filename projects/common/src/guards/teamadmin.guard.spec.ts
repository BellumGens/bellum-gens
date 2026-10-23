import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { TeamadminGuard } from './teamadmin.guard';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { environment } from '../environments/environment';

describe('TeamadminGuard', () => {
  const route = { parent: { params: { teamid: 'team-1' } } } as unknown as ActivatedRouteSnapshot;

  const configure = (platform: string) => {
    TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register('', { enabled: false })
      ],
      providers: [
        TeamadminGuard,
        { provide: PLATFORM_ID, useValue: platform },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    return TestBed.inject(TeamadminGuard);
  };

  it('should ask the API whether the user administers the team in the route', () => {
    const guard = configure('browser');
    const httpMock = TestBed.inject(HttpTestingController);
    let allowed: boolean;

    (guard.canActivate(route) as ReturnType<TeamadminGuard['isTeamAdmin']>).subscribe(result => allowed = result);
    const req = httpMock.expectOne(`${environment.apiEndpoint}/teams/teamadmin?teamid=team-1`);
    expect(req.request.withCredentials).toBe(true);
    req.flush(false);

    expect(allowed).toBe(false);
    httpMock.verify();
  });

  it('should let the server render the page, leaving the check to the browser', () => {
    const guard = configure('server');

    expect(guard.canActivate(route)).toBe(true);
    TestBed.inject(HttpTestingController).verify();
  });
});
