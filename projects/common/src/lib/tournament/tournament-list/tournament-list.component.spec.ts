import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TournamentListComponent } from './tournament-list.component';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { Tournament, TournamentStatus } from '../../../models/tournament';

describe('TournamentListComponent', () => {
  let component: TournamentListComponent;
  let fixture: ComponentFixture<TournamentListComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentListComponent],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading true', () => {
    expect(component.loading()).toBe(true);
  });

  it('should set loading to false after tournaments load', () => {
    const tournaments: Tournament[] = [
      { id: '1', name: 'Tournament 1', status: TournamentStatus.Open }
    ];

    const req = httpMock.expectOne(r => r.url.includes('/tournament/tournaments'));
    req.flush(tournaments);

    expect(component.loading()).toBe(false);
    expect(component.tournaments().length).toBe(1);
  });

  it('should filter active tournaments', () => {
    const tournaments: Tournament[] = [
      { id: '1', name: 'Open', status: TournamentStatus.Open },
      { id: '2', name: 'InProgress', status: TournamentStatus.InProgress },
      { id: '3', name: 'Completed', status: TournamentStatus.Completed },
      { id: '4', name: 'Draft', status: TournamentStatus.Draft }
    ];

    const req = httpMock.expectOne(r => r.url.includes('/tournament/tournaments'));
    req.flush(tournaments);

    expect(component.activeTournaments().length).toBe(2);
    expect(component.completedTournaments().length).toBe(1);
  });

  it('should navigate to create on createTournament', () => {
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.createTournament();
    expect(spy).toHaveBeenCalledWith(['/tournaments/create']);
  });

  it('should navigate to manage on manageTournament', () => {
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.manageTournament({ id: 't1', name: 'Test' });
    expect(spy).toHaveBeenCalledWith(['/tournaments/manage', 't1']);
  });

  it('should call deleteTournament on service', () => {
    // vi.spyOn calls through by default, matching the original .and.callThrough()
    const spy = vi.spyOn(apiService, 'deleteTournament');
    component.onDeleteTournament({ id: 't1', name: 'Test' });
    expect(spy).toHaveBeenCalledWith('t1');
  });

  it('should have empty invite code initially', () => {
    expect(component.inviteCode).toBe('');
  });
});
