import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerComponent } from './player.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { BellumgensApiService } from 'bellum-gens-common';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            ServiceWorkerModule.register('', { enabled: false }),
            PlayerComponent],
        providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize player as null', () => {
    expect(component.player()).toBeNull();
  });

  it('should load player data when route params contain userid', () => {
    const apiService = TestBed.inject(BellumgensApiService);
    const mockPlayer = {
      id: 'test-id',
      username: 'TestPlayer',
      email: 'test@test.com'
    };

    vi.spyOn(apiService, 'getPlayer').mockReturnValue(signal(mockPlayer as any).asReadonly());

    // Trigger route change
    const activatedRoute = TestBed.inject(ActivatedRoute) as ActivatedRoute;
    (activatedRoute.params as any).next({ userid: 'test-id' });

    expect(apiService.getPlayer).toHaveBeenCalledWith('test-id');
  });

  it('should set player when API returns data', async () => {
    const apiService = TestBed.inject(BellumgensApiService);
    const mockPlayer = {
      id: 'test-id',
      username: 'TestPlayer',
      email: 'test@test.com'
    };

    vi.spyOn(apiService, 'getPlayer').mockReturnValue(signal(mockPlayer as any).asReadonly());

    const activatedRoute = TestBed.inject(ActivatedRoute) as ActivatedRoute;
    (activatedRoute.params as any).next({ userid: 'test-id' });

    await fixture.whenStable();

    expect(component.player()).toEqual(mockPlayer);
  });

  it('should keep the previous player while the next one is loading', () => {
    const apiService = TestBed.inject(BellumgensApiService);
    const cached = signal<any>({ id: 'player-a' });
    vi.spyOn(apiService, 'getPlayer').mockReturnValue(cached.asReadonly());

    const activatedRoute = TestBed.inject(ActivatedRoute) as ActivatedRoute;
    (activatedRoute.params as any).next({ userid: 'player-a' });
    expect(component.player().id).toBe('player-a');

    // navigating to another player clears the service cache until it loads
    cached.set(null);
    (activatedRoute.params as any).next({ userid: 'player-b' });
    expect(component.player().id).toBe('player-a');

    cached.set({ id: 'player-b' });
    expect(component.player().id).toBe('player-b');
  });
});
