import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsMainComponent } from './tournaments-main.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiTournamentsService, Tournament } from 'projects/common/src/public_api';

describe('TournamentsMainComponent', () => {
  let component: TournamentsMainComponent;
  let fixture: ComponentFixture<TournamentsMainComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentsMainComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tournaments observable and filter data correctly', () => {
    const now = Date.now();
    const pastDate = new Date(now - 86400000); // 1 day ago
    const futureDate = new Date(now + 86400000); // 1 day from now

    const tournaments: Tournament[] = [
      { id: '1', name: 'Active Tournament', active: true, startDate: pastDate, endDate: futureDate },
      { id: '2', name: 'Inactive Tournament', active: false, startDate: pastDate, endDate: futureDate },
      { id: '3', name: 'Past Tournament', active: true, startDate: pastDate, endDate: pastDate },
      { id: '4', name: 'Upcoming Tournament', active: true, startDate: futureDate, endDate: futureDate }
    ];

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(tournaments);

    expect(component.tournaments.length).toBe(3); // active tournaments (id 1, 3, 4)
    expect(component.past.length).toBe(1); // past tournament (id 3)
    expect(component.upcoming.length).toBe(1); // upcoming tournament (id 4)
  });
});
