import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTournamentsComponent } from './team-tournaments.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { signal } from '@angular/core';
import { CSGOTeam, TEAM_PLACEHOLDER, Tournament } from '../../../../../common/src/public_api';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('TeamTournamentsComponent', () => {
  let component: TeamTournamentsComponent;
  let fixture: ComponentFixture<TeamTournamentsComponent>;
  let httpMock: HttpTestingController;
  const team = signal<CSGOTeam>(TEAM_PLACEHOLDER);

  beforeEach(async () => {
    team.set(TEAM_PLACEHOLDER);
    await TestBed.configureTestingModule({
      imports: [

        TeamTournamentsComponent
      ],
      providers: [
        { provide: ROUTER_OUTLET_DATA, useValue: team },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have emptyGuid property defined as expected string value', () => {
    expect(component.emptyGuid).toBeDefined();
    expect(typeof component.emptyGuid).toBe('string');
    expect(component.emptyGuid).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('should show no tournaments when loading fails and load them for the next team', async () => {
    team.set({ ...TEAM_PLACEHOLDER, teamId: 'team-1' });
    await fixture.whenStable();
    httpMock.expectOne(r => r.url.includes('teamid=team-1')).flush('error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(component.tournaments()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('This team has not participated in any competitions.');

    const tournaments = [{ id: 't-1', name: 'Cup' }] as Tournament [];
    team.set({ ...TEAM_PLACEHOLDER, teamId: 'team-2' });
    await fixture.whenStable();
    httpMock.expectOne(r => r.url.includes('teamid=team-2')).flush(tournaments);
    await fixture.whenStable();

    expect(component.tournaments()).toEqual(tournaments);
  });
});
