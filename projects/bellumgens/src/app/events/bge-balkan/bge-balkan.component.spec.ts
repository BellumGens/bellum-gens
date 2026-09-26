import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BgeBalkanComponent } from './bge-balkan.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BgeBalkanComponent', () => {
  let component: BgeBalkanComponent;
  let fixture: ComponentFixture<BgeBalkanComponent>;
  let apiService: ApiTournamentsService;
  //let loginService: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BgeBalkanComponent,
        
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    apiService = TestBed.inject(ApiTournamentsService);
    //loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgeBalkanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', async () => {
    const mockTournament = { id: '123' } as any;
    const mockRegistrations = [{ id: 'reg1' }] as any[];
    const mockMatches = [{ id: 'match1' }] as any[];
    const mockGroups = [{ id: 'group1' }] as any[];

    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockTournament);
    expect(component.tournament()).toEqual(mockTournament);
    expect(component.tournamentId()).toBe('123');
    // Rendering the tournament's data kicks off loading it
    await fixture.whenStable();
    expect(component.loading()).toBe(true);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockRegistrations);
    expect(component.loading()).toBe(false);
    expect(component.registrations()).toEqual(mockRegistrations);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    expect(component.loadingMatches()).toBe(true);
    req.flush(mockMatches);
    expect(component.loadingMatches()).toBe(false);
    expect(component.sc2matches()).toEqual(mockMatches);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockGroups);
    expect(component.groups()).toEqual(mockGroups);
  });

  it('should refresh groups', async () => {
    const mockGroups = [{ id: 'group1' }] as any[];

    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`).flush({ id: '123' });
    await fixture.whenStable();
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`).flush([]);

    component.refreshGroups();

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockGroups);
    expect(component.groups()).toEqual(mockGroups);
  });

  it('should refresh matches', async () => {
    const mockMatches = [{ id: 'match1' }] as any[];

    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`).flush({ id: '123' });
    await fixture.whenStable();
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`).flush([]);

    component.refreshMatches();

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockMatches);
    expect(component.sc2matches()).toEqual(mockMatches);
  });
});
