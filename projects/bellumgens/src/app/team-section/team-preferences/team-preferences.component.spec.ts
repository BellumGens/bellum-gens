import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ROUTER_OUTLET_DATA } from '@angular/router';
import { signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TEAM_PLACEHOLDER } from '../../../../../common/src/public_api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamPreferencesComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            },
            data: new Observable()
        }
        },
        { provide: ROUTER_OUTLET_DATA, useValue: signal(TEAM_PLACEHOLDER) },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authUser', () => {
    expect(component.authUser()).toBeDefined();
  });

  it('should initialize team property with TEAM_PLACEHOLDER', () => {
    expect(component.team()).toBeDefined();
    expect(component.team()).toEqual(TEAM_PLACEHOLDER);
  });
});
