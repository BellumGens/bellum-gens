import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { of } from 'rxjs';

import { TournamentDetailComponent } from './tournament-detail.component';
import { TournamentStatus, TournamentVisibility, Game } from '../../../models/tournament';

describe('TournamentDetailComponent', () => {
  let component: TournamentDetailComponent;
  let fixture: ComponentFixture<TournamentDetailComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({ tournamentId: 't1' }) }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading true', () => {
    expect(component.loading()).toBe(true);
  });

  it('should start with no tournament', () => {
    expect(component.tournament()).toBeNull();
  });

  it('should load tournament from route params', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Test Tournament',
      status: TournamentStatus.Open,
      visibility: TournamentVisibility.Public,
      game: Game.CSGO
    });

    expect(component.tournament()).toBeTruthy();
    expect(component.tournament()!.name).toBe('Test Tournament');
    expect(component.loading()).toBe(false);
  });

  it('should return correct status label', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({ id: 't1', name: 'Test', status: TournamentStatus.InProgress });

    expect(component.statusLabel).toBe('In Progress');
  });

  it('should return correct visibility icon', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({ id: 't1', name: 'Test', visibility: TournamentVisibility.Private });

    expect(component.visibilityIcon).toBe('lock');
  });

  it('should return empty status label when no tournament', () => {
    expect(component.statusLabel).toBe('');
  });

  it('should return public visibility icon when no tournament', () => {
    expect(component.visibilityIcon).toBe('public');
  });

  it('should compute canJoin for open public tournament', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Test',
      status: TournamentStatus.Open,
      visibility: TournamentVisibility.Public
    });

    expect(component.canJoin()).toBeTruthy();
  });

  it('should not allow join for private tournament', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Test',
      status: TournamentStatus.Open,
      visibility: TournamentVisibility.Private
    });

    expect(component.canJoin()).toBeFalsy();
  });
});

describe('TournamentDetailComponent (no route param)', () => {
  let component: TournamentDetailComponent;
  let fixture: ComponentFixture<TournamentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not load tournament when no tournamentId param', () => {
    expect(component.tournament()).toBeNull();
    expect(component.loading()).toBe(true);
  });
});
