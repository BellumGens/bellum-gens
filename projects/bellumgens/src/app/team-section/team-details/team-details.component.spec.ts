import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamDetailsComponent } from './team-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamDetailsComponent', () => {
  let component: TeamDetailsComponent;
  let fixture: ComponentFixture<TeamDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamDetailsComponent
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
    fixture = TestBed.createComponent(TeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with team placeholder', () => {
    expect(component.team).toBeDefined();
    expect(component.team.teamName).toBe('Create or view teams');
  });

  it('should initialize isAdmin as false', () => {
    expect(component.isAdmin).toBe(false);
  });

  it('should have 5 role slots', () => {
    expect(component.roleSlots).toBeDefined();
    expect(component.roleSlots.length).toBe(5);
  });

  it('should have role slots with correct names', () => {
    const roleNames = component.roleSlots.map(slot => slot.roleName);
    expect(roleNames).toContain('IGL');
    expect(roleNames).toContain('Awper');
    expect(roleNames).toContain('Entry Fragger');
    expect(roleNames).toContain('Support');
    expect(roleNames).toContain('Lurker');
  });
});
