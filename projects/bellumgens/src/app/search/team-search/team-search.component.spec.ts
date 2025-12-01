import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamSearchComponent', () => {
  let component: TeamSearchComponent;
  let fixture: ComponentFixture<TeamSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamSearchComponent
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchModel', () => {
    expect(component.searchModel).toBeDefined();
  });

  it('should have activeLineup with 5 roles', () => {
    expect(component.activeLineup).toBeDefined();
    expect(component.activeLineup.length).toBe(5);
  });

  it('should have parseInt reference', () => {
    expect(component.parseInt).toBe(parseInt);
  });

  it('should have searchTeams method', () => {
    expect(component.searchTeams).toBeDefined();
    expect(typeof component.searchTeams).toBe('function');
  });

  it('should have authUser property', () => {
    expect(component.authUser).toBeUndefined();
  });
});
