import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './team.routes';
import { TeamNavComponent } from './team-nav/team-nav.component';

@Component({ template: '' })
class TeamNavStubComponent {}

describe('team routes', () => {
  it('should redirect to the user\'s teams when no team is selected', async () => {
    // The real components are swapped for a stub, only the redirect is under test
    const stubbed = routes.map(route => route.component === TeamNavComponent ? { ...route, component: TeamNavStubComponent } : route);
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'team', children: stubbed.filter(route => !route.path?.startsWith(':')) }])]
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/team', TeamNavStubComponent);

    expect(TestBed.inject(Router).url).toBe('/team/myteams');
  });
});
