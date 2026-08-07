import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoComponent } from './event-info.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { Observable, of, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;
  let apiService: ApiTournamentsService;
  //let loginService: LoginService;
  let httpMock: HttpTestingController;
  let metaService: Meta;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventInfoComponent,

        NoopAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ tournamentId: '123' }), data: new Observable<any>() } },
        Title,
        Meta,
        provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiTournamentsService);
    metaService = TestBed.inject(Meta);
    httpMock = TestBed.inject(HttpTestingController);
  });

    beforeEach(() => {
      fixture = TestBed.createComponent(EventInfoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tournament details on init', () => {
    const mockTournament = { id: '123', name: 'Test Tournament', description: 'Test Description', logo: 'test-logo' } as any;
    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockTournament);
    expect(component.tournament).toEqual(mockTournament);
    expect(component.tournamentId).toBe('123');
    expect(metaService.getTag('name="og:title"').content).toBe('Test Tournament');
    expect(metaService.getTag('name="og:image"').content).toBe('test-logo');
    expect(metaService.getTag('name="description"').content).toBe('Test Description');
    expect(metaService.getTag('name="twitter:title"').content).toBe('Test Tournament');
  });

  it('should call getSc2Registrations and getSc2Matches on init', () => {
    const mockRegistrations = [{ id: 'reg1' }] as any[];
    const mockTournament = { id: '123', name: 'Test Tournament', description: 'Test Description', logo: 'test-logo' } as any;
    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockTournament);

    component.loading.pipe(take(1)).subscribe(value => expect(value).toBe(true));
    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockRegistrations);
    component.registrations.pipe(take(1)).subscribe(value => expect(value).toEqual(mockRegistrations));
    component.loading.pipe(take(1)).subscribe(value => expect(value).toBe(false));

    const mockMatches = [{ id: 'match1' }] as any[];
    component.loadingMatches.pipe(take(1)).subscribe(value => expect(value).toBe(true));
    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockMatches);
    component.loadingMatches.pipe(take(1)).subscribe(value => expect(value).toBe(false));
    component.sc2matches.pipe(take(1)).subscribe(value => expect(value).toEqual(mockMatches));
  });

  it('should refresh matches', () => {
    vi.spyOn(apiService, 'getSc2Matches').mockImplementation(() => undefined);
    component.refreshMatches();
    expect(apiService.getSc2Matches).toHaveBeenCalledWith('123');
  });
});
