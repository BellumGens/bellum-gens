import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TEAM_PLACEHOLDER } from '../../../../../common/src/public_api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPreferencesComponent);
    component = fixture.componentInstance;
    component.team = TEAM_PLACEHOLDER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authUser', () => {
    expect(component.authUser).toBeDefined();
  });

  it('should initialize team property', () => {
    expect(component.team).toBeDefined();
    expect(component.team).toEqual(TEAM_PLACEHOLDER);
  });

  it('should have team property initialized', () => {
    expect(component.team).toBeDefined();
    expect(component.team).toEqual(TEAM_PLACEHOLDER);
  });

  it('should have team property', () => {
    expect(component.team).toBeDefined();
  });
});
