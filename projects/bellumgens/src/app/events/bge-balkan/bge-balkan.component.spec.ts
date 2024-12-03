import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BgeBalkanComponent } from './bge-balkan.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
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
    expect(component.loading).toBeTrue();
    req.flush(mockTournament);
    expect(component.loading).toBeTrue();
    expect(component.tournament).toEqual(mockTournament);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    req.flush(mockRegistrations);
    expect(component.loading).toBeFalse();
    expect(component.registrations).toEqual(mockRegistrations);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    expect(component.loadingMatches).toBeTrue();
    req.flush(mockMatches);
    expect(component.loadingMatches).toBeFalse();
    expect(component.sc2matches).toEqual(mockMatches);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse();
    expect(component.loadingGroups).toBeTrue();
    req.flush(mockGroups);
    expect(component.loadingGroups).toBeFalse();
    expect(component.groups).toEqual(mockGroups);
  });
});
