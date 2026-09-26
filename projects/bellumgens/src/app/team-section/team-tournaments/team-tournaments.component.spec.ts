import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTournamentsComponent } from './team-tournaments.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { signal } from '@angular/core';
import { TEAM_PLACEHOLDER } from '../../../../../common/src/public_api';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('TeamTournamentsComponent', () => {
  let component: TeamTournamentsComponent;
  let fixture: ComponentFixture<TeamTournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        TeamTournamentsComponent
      ],
      providers: [
        { provide: ROUTER_OUTLET_DATA, useValue: signal(TEAM_PLACEHOLDER) },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
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
});
