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
    const twoDaysAgo = new Date(now - 172800000); // 2 days ago
    const oneDayAgo = new Date(now - 86400000); // 1 day ago
    const oneDayFromNow = new Date(now + 86400000); // 1 day from now
    const twoDaysFromNow = new Date(now + 172800000); // 2 days from now

    const tournaments: Tournament[] = [
      { id: '1', name: 'Active Current Tournament', active: true, startDate: oneDayAgo, endDate: oneDayFromNow },
      { id: '2', name: 'Inactive Tournament', active: false, startDate: oneDayAgo, endDate: oneDayFromNow },
      { id: '3', name: 'Past Tournament', active: true, startDate: twoDaysAgo, endDate: oneDayAgo },
      { id: '4', name: 'Upcoming Tournament', active: true, startDate: oneDayFromNow, endDate: twoDaysFromNow }
    ];

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(tournaments);

    // tournaments array: active=true (id 1, 3, 4)
    expect(component.tournaments.length).toBe(3);
    // past array: endDate < now (id 3)
    expect(component.past.length).toBe(1);
    expect(component.past[0].id).toBe('3');
    // upcoming array: startDate > now (id 4)
    expect(component.upcoming.length).toBe(1);
    expect(component.upcoming[0].id).toBe('4');
  });
});
