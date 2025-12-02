import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        PlayerSearchComponent
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchModel', () => {
    expect(component.searchModel).toBeDefined();
  });

  it('should initialize userOverlap to 0', () => {
    expect(component.userOverlap).toBe(0);
  });

  it('should initialize teamName', () => {
    expect(component.teamName).toBe('Select Team');
  });

  it('should have activeLineup with 5 roles', () => {
    expect(component.activeLineup).toBeDefined();
    expect(component.activeLineup.length).toBe(5);
  });

  it('should have searchPlayers method', () => {
    expect(component.searchPlayers).toBeDefined();
    expect(typeof component.searchPlayers).toBe('function');
  });

  it('should have teamAdmin property', () => {
    expect(component.teamAdmin).toBeDefined();
  });
});
