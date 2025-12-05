import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserPreferencesComponent } from './user-preferences.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ApplicationUser, CommunicationService, Game, LoginProvider, LoginService, TournamentApplication, TournamentApplicationState } from '../../../public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('UserPreferencesComponent', () => {
  let component: UserPreferencesComponent;
  let fixture: ComponentFixture<UserPreferencesComponent>;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;
  let router: Router;
  let authService: LoginService;
  const providers: LoginProvider [] = [
    { name: 'Steam', state: 'test', url: 'test' },
    { name: 'BattleNet', state: 'test', url: 'test' }
  ];
  const applicationUser: ApplicationUser = {
    id: '1',
    steamId: 'test-steam-id',
    battleNetId: 'test-battlenet-id',
    username: 'test-user',
    email: 'test-email',
    searchVisible: false,
    steamUserException: false,
    userStatsException: false,
    registered: true,
    externalLogins: [
      'Steam'
    ]
  };
  const registrations: TournamentApplication [] = [
    { id: '1', game: Game.CSGO, email: 'test-email', dateSubmitted: new Date(), state: TournamentApplicationState.Pending },
    { id: '2', game: Game.StarCraft2, email: 'test-email', dateSubmitted: new Date(), state: TournamentApplicationState.Pending }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        UserPreferencesComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    authService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    req.flush(applicationUser);
    const req2 = httpMock.expectOne(`${authService['_apiBase']}/tournament/registrations`);
    req2.flush(registrations);
    const req3 = httpMock.expectOne(`${authService['_apiEndpoint']}/ExternalLogins?returnUrl=%2F`);
    req3.flush(providers);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default preferences', () => {
    expect(component.authUser).toBe(applicationUser);
    expect(component.preferences).toEqual({ searchVisible: false, email: 'test-email' });
  });

  it('should have providers', () => {
    expect(component.providers).toEqual(providers);
  });

  it('should have registrations', () => {
    expect(component.registrations).toEqual(registrations);
    expect(authService['_registrations'].value).toEqual(registrations);
  });

  it('should call login method', () => {
    spyOn(authService, 'login');
    component.login(providers[0]);
    expect(authService.login).toHaveBeenCalledWith(providers[0]);
  });

  it('should call submitPreferences method', () => {
    commsService.success.subscribe(message => expect(message).toEqual('Preferences updated successfully!'));
    component.submitPreferences();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}/userinfo`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(component.preferences);
    expect(req.request.withCredentials).toBeTrue();
    req.flush({});

    commsService.error.subscribe(message => expect(message).toEqual(`Http failure response for ${authService['_apiEndpoint']}/userinfo: 500 Something went wrong!`));
    component.submitPreferences();
    const req2 = httpMock.expectOne(`${authService['_apiEndpoint']}/userinfo`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(component.preferences);
    expect(req2.request.withCredentials).toBeTrue();
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Something went wrong!' });
  });

  it('should call deleteAccount method', () => {
    commsService.success.subscribe(message => expect(message).toEqual('Account deleted!'));
    component.deleteAccount();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({});

    commsService.error.subscribe(message => expect(message).toEqual(`Http failure response for ${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}: 500 Something went wrong!`));
    component.deleteAccount();
    const req2 = httpMock.expectOne(`${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}`);
    expect(req2.request.method).toBe('DELETE');
    expect(req2.request.withCredentials).toBeTrue();
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Something went wrong!' });
  });

  it('should call deleteRegistration method', () => {
    expect(component.registrations).toEqual(registrations);
    expect(authService['_registrations'].value).toEqual(registrations);

    const registration = registrations[0];
    commsService.success.subscribe(message => expect(message).toEqual('Tournament application deleted successfully!'));
    component.deleteRegistration(registration);
    const req2 = httpMock.expectOne(`${authService['_apiBase']}/tournament/delete?id=${registration.id}`);
    expect(req2.request.method).toBe('DELETE');
    expect(req2.request.withCredentials).toBeTrue();
    req2.flush({});
    expect(component.registrations).toEqual([registrations[0]]);

    commsService.error.subscribe(message => expect(message).toEqual(`Http failure response for ${authService['_apiBase']}/tournament/delete?id=${registration.id}: 500 Something went wrong!`));
    component.deleteRegistration(registration);
    const req3 = httpMock.expectOne(`${authService['_apiBase']}/tournament/delete?id=${registration.id}`);
    expect(req3.request.method).toBe('DELETE');
    expect(req3.request.withCredentials).toBeTrue();
    req3.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Something went wrong!' });
  });

  it('disableLogin should return true for externalLogins on the authUser', () => {
    expect(component.disableLogin('BattleNet')).toBeFalse();
    expect(component.disableLogin('Steam')).toBeTrue();
  });

  it('should call openRegistration method', () => {
    spyOn(router, 'navigate');
    component.openRegistration();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });
});
