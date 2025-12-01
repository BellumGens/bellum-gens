import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerComponent } from './player.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BellumgensApiService } from 'bellum-gens-common';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        PlayerComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize player as undefined', () => {
    expect(component.player).toBeUndefined();
  });

  it('should load player data when route params contain userid', () => {
    const apiService = TestBed.inject(BellumgensApiService);
    const mockPlayer = {
      id: 'test-id',
      username: 'TestPlayer',
      email: 'test@test.com'
    };

    const playerSubject = new BehaviorSubject(mockPlayer as any);
    spyOn(apiService, 'getPlayer').and.returnValue(playerSubject);

    // Trigger route change
    const activatedRoute = TestBed.inject(ActivatedRoute) as ActivatedRoute;
    (activatedRoute.params as any).next({ userid: 'test-id' });

    expect(apiService.getPlayer).toHaveBeenCalledWith('test-id');
  });

  it('should set player when API returns data', (done) => {
    const apiService = TestBed.inject(BellumgensApiService);
    const mockPlayer = {
      id: 'test-id',
      username: 'TestPlayer',
      email: 'test@test.com'
    };

    const playerSubject = new BehaviorSubject(mockPlayer as any);
    spyOn(apiService, 'getPlayer').and.returnValue(playerSubject);

    const activatedRoute = TestBed.inject(ActivatedRoute) as ActivatedRoute;
    (activatedRoute.params as any).next({ userid: 'test-id' });

    setTimeout(() => {
      expect(component.player).toBeDefined();
      done();
    }, 100);
  });
});
