import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwPush } from '@angular/service-worker';
import { LoginService } from './login.service';
import { ApplicationUser, CSGOTeam, CommunicationService, Game, LoginProvider, NotificationState, TournamentApplication, UserLogin, UserNotification, UserPreferences, UserRegistration } from '../public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('LoginService', () => {
  let service: LoginService;
  let commsService: CommunicationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false })
      ],
      providers: [
          LoginService,
          { provide: SwPush, useValue: {} },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LoginService);
    commsService = TestBed.inject(CommunicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit openLogin event', () => {
    const openLoginSpy = spyOn(service.openLogin, 'emit');
    service.emitOpenLogin();
    expect(openLoginSpy).toHaveBeenCalled();
  });

  it('should add push subscriber', () => {
    const pushSubscription: PushSubscription = {
      endpoint: 'test-endpoint',
      expirationTime: 123,
      options: {
        applicationServerKey: null,
        userVisibleOnly: true
      },
      toJSON: () => {
        return {};
      },
      getKey: () => {
        return new ArrayBuffer(0);
      },
      unsubscribe: () => new Promise(
        (resolve) => {
          resolve(true);
        }
      )
    };

    service.addPushSubscriber(pushSubscription).subscribe();

    const req = httpMock.expectOne(`${service['_apiBase']}/push/subscribe`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(pushSubscription);
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should return login providers', () => {
    const providers: LoginProvider [] = [
      { name: 'test-provider', url: 'test-url', state: 'test-state' },
      { name: 'test-provider-2', url: 'test-url-2', state: 'test-state-2' }
    ];

    service.loginProviders.subscribe(loginProviders => {
      expect(loginProviders).toEqual(providers);
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/ExternalLogins?returnUrl=%2F`);
    expect(req.request.method).toEqual('GET');
    req.flush(providers);
  });

  it('should return tournament registrations', () => {
    const registrations: TournamentApplication [] = [
      { id: '1', game: Game.CSGO, email: 'test-email', state: 0 },
      { id: '2', game: Game.StarCraft2, email: 'test-email', state: 1 }
    ];

    service.tournamentRegistrations.subscribe();

    const req = httpMock.expectOne(`${service['_apiBase']}/tournament/registrations`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(registrations);

    expect(service['_registrations'].value).toEqual(registrations);
  });

  it('should return teams admin', () => {
    const teamsAdmin: CSGOTeam[] = [
      { teamId: '1', teamName: 'Team 1', teamAvatar: 'test-avatar', visible: true },
      { teamId: '2', teamName: 'Team 2', teamAvatar: 'test-avatar-2', visible: true }
    ];

    service.teamsAdmin.subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/userteamsadmin`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(teamsAdmin);

    expect(service['_teamsAdmin'].value).toEqual(teamsAdmin);
  });

  it('should get application user', () => {
    const applicationUser: ApplicationUser = {
      id: '1',
      steamId: 'test-steam-id',
      battleNetId: 'test-battlenet-id',
      username: 'test-user',
      email: 'test-email',
      searchVisible: true,
      steamUserException: false,
      userStatsException: false,
      registered: true,
      externalLogins: []
    };

    service.applicationUser.subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(applicationUser);

    expect(service['_applicationUser'].value).toEqual(applicationUser);
  });

  it('should get user notifications', () => {
    const userNotifications: UserNotification[] = [
      { state: NotificationState.Seen, teamInfo: null, invitingUser: null, sent: '2021-01-01T00:00:00.000Z' },
      { state: NotificationState.Accepted, teamInfo: null, invitingUser: null, sent: '2021-01-01T00:00:00.000Z' }
    ];

    service.userNotifications.subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/usernotifications`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(userNotifications);

    expect(service['_userNotifications'].value).toEqual(userNotifications);
  });

  it('should get user is team member', () => {
    const teamId = 'test-team-id';
    service.getUserIsTeamMember(teamId).subscribe(member => expect(member).toBe(true));

    const req = httpMock.expectOne(`${service['_apiBase']}/teams/teammember?teamid=${teamId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(true);
  });

  it('should get user is team editor', () => {
    const teamId = 'test-team-id';
    service.getUserIsTeamEditor(teamId).subscribe(member => expect(member).toBe(true));

    const req = httpMock.expectOne(`${service['_apiBase']}/teams/teameditor?teamid=${teamId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(true);
  });

  it('should login with form', () => {
    const loginInfo: UserLogin = { username: 'test-username', password: 'test-password', rememberMe: true };
    const applicationUser: ApplicationUser = {
      id: '1',
      steamId: 'test-steam-id',
      battleNetId: 'test-battlenet-id',
      username: 'test-username',
      email: 'test-email',
      steamUserException: false,
      userStatsException: false,
      registered: true,
      searchVisible: true,
      externalLogins: []
    };
    const registrations: TournamentApplication [] = [
      { id: '1', game: Game.CSGO, email: 'test-email', state: 0 },
      { id: '2', game: Game.StarCraft2, email: 'test-email', state: 1 }
    ];

    service.loginWithForm(loginInfo).subscribe(response => {
      expect(response).toEqual(applicationUser);
    });
    commsService.success.subscribe(success => expect(success).toBe('Logged in successfully!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(loginInfo);
    expect(req.request.withCredentials).toEqual(true);
    req.flush(applicationUser);
    expect(service['_applicationUser'].value).toEqual(applicationUser);

    const req2 = httpMock.expectOne(`${service['_apiBase']}/tournament/registrations`);
    expect(req2.request.method).toEqual('GET');
    expect(req2.request.withCredentials).toEqual(true);
    req2.flush(registrations);
    expect(service['_registrations'].value).toEqual(registrations);
  });

  it('should logout', () => {
    service.logout().subscribe();
    commsService.success.subscribe(success => expect(success).toBe('Logged out successfully!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/logout`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
    expect(service['_applicationUser'].value).toBeNull();
  });

  it('should submit registration', () => {
    const userAccount: UserRegistration = { username: 'test-username', password: 'test-password', confirmPassword: 'test-password', email: 'test-email' };
    service.submitRegistration(userAccount).subscribe();
    commsService.success.subscribe(success => expect(success).toBe('User registration completed successfully!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/setpassword`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(userAccount);
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should delete account', () => {
    const userId = 'test-user-id';
    service.deleteAccount(userId).subscribe();
    commsService.success.subscribe(success => expect(success).toBe('Account deleted!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/delete?userid=${userId}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
    expect(service['_applicationUser'].value).toBeNull();
  });

  it('should check username', () => {
    const username = 'test-username';
    service.checkUsername(username).subscribe(response => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/username?username=${username}`);
    expect(req.request.method).toEqual('GET');
    req.flush(true);
  });

  it('should update user preferences', () => {
    const preferences: UserPreferences = { searchVisible: false, email: 'test-email' };
    service.updateUserPreferences(preferences).subscribe();
    commsService.success.subscribe(success => expect(success).toBe('Preferences updated successfully!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/userinfo`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(preferences);
    expect(req.request.withCredentials).toEqual(true);
    req.flush({ newEmail: true, email: 'test-email', searchVisible: false });
  });

  it('should add subscriber', () => {
    const email = 'test-email';
    service.addSubscriber(email).subscribe();
    commsService.success.subscribe(success => expect(success).toBe('Subscribed successfully!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/account/subscribe`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email: email });
    req.flush({});
  });

  it('should get user roles', () => {
    service.getUserRoles().subscribe();
    const req = httpMock.expectOne(`${service['_apiBase']}/admin/roles`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should get promo codes', () => {
    service.getPromoCodes().subscribe();
    const req = httpMock.expectOne(`${service['_apiBase']}/admin/promos`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should submit role', () => {
    const role = 'test-role';
    service.submitRole(role).subscribe();
    const req = httpMock.expectOne(`${service['_apiBase']}/admin/createrole?rolename=${role}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(role);
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should add user to role', () => {
    const userId = 'test-user-id';
    const role = 'test-role';
    service.addUserToRole(userId, role).subscribe();
    const req = httpMock.expectOne(`${service['_apiBase']}/admin/adduserrole?userid=${userId}&role=${role}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(role);
    expect(req.request.withCredentials).toEqual(true);
  });

});
