import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamNavComponent } from './team-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamNewComponent } from '../team-new/team-new.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamNavComponent', () => {
  let component: TeamNavComponent;
  let fixture: ComponentFixture<TeamNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamNewComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authUser as null', () => {
    expect(component.authUser).toBeNull();
  });

  it('should initialize teams as undefined when no user is authenticated', () => {
    expect(component.teams).toBeUndefined();
  });

  it('should have abandonTeam method', () => {
    expect(component.abandonTeam).toBeDefined();
    expect(typeof component.abandonTeam).toBe('function');
  });

  it('should initialize activeMembers and inactiveMembers as undefined', () => {
    expect(component.activeMembers).toBeUndefined();
    expect(component.inactiveMembers).toBeUndefined();
  });
});
