import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BgeBalkanComponent } from './bge-balkan.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { take } from 'rxjs';

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
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

  it('should initialize with correct data', () => {
    const mockTournament = { id: '123' } as any;
    const mockRegistrations = [{ id: 'reg1' }] as any[];
    const mockMatches = [{ id: 'match1' }] as any[];
    const mockGroups = [{ id: 'group1' }] as any[];

    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/activetournament`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    req.flush(mockTournament);
    component.loading.pipe(take(1)).subscribe(value => expect(value).toBeTrue());
    expect(component.tournament).toEqual(mockTournament);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    req.flush(mockRegistrations);
    component.loading.pipe(take(1)).subscribe(value => expect(value).toBeFalse());

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    component.loadingMatches.pipe(take(1)).subscribe(value => expect(value).toBeTrue());
    req.flush(mockMatches);
    component.loadingMatches.pipe(take(1)).subscribe(value => expect(value).toBeFalse());

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    req.flush(mockGroups);
  });
});
