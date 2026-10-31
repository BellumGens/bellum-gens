import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwPush } from '@angular/service-worker';
import { LoginService } from './login.service';
import { ApplicationUser, CSGOTeam, CommunicationService, LoginProvider, NotificationState, TournamentApplication, UserLogin, UserNotification, UserPreferences, UserRegistration } from '../public_api';
import { Game } from '../models/tournament';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';


describe('LoginService', () => {
  let service: LoginService;
  let commsService: CommunicationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        ServiceWorkerModule.register('', { enabled: false })
      ],
      providers: [
          LoginService,
          { provide: SwPush, useValue: {} },
          provideHttpClient(withXhr(), withInterceptorsFromDi()),
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
    const openLoginSpy = vi.fn();
    const sub = service.openLogin.subscribe(openLoginSpy);
    service.emitOpenLogin();
    expect(openLoginSpy).toHaveBeenCalledTimes(1);
    sub.unsubscribe();
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

    const result = service.tournamentRegistrations;
    expect(result()).toBeNull();

    const req = httpMock.expectOne(`${service['_apiBase']}/tournament/registrations`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(registrations);

    expect(service['_registrations']()).toEqual(registrations);
    expect(result()).toEqual(registrations);

    // cached: accessing again does not trigger another request
    expect(service.tournamentRegistrations()).toEqual(registrations);
    httpMock.expectNone(`${service['_apiBase']}/tournament/registrations`);
  });

  it('should set tournament registrations', () => {
    const registrations: TournamentApplication [] = [
      { id: '1', game: Game.CSGO, email: 'test-email', state: 0 }
    ];

    service.setTournamentRegistrations(registrations);

    expect(service.tournamentRegistrations()).toEqual(registrations);
    httpMock.expectNone(`${service['_apiBase']}/tournament/registrations`);
  });

  it('should return teams admin', () => {
    const teamsAdmin: CSGOTeam[] = [
      { teamId: '1', teamName: 'Team 1', teamAvatar: 'test-avatar', visible: true },
      { teamId: '2', teamName: 'Team 2', teamAvatar: 'test-avatar-2', visible: true }
    ];

    const result = service.teamsAdmin;

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/userteamsadmin`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(teamsAdmin);

    expect(service['_teamsAdmin']()).toEqual(teamsAdmin);
    expect(result()).toEqual(teamsAdmin);
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

    const result = service.applicationUser;
    expect(result()).toBeNull();
    expect(service.userCheckInProgress()).toBe(true);

    // a second access while the check is in progress does not trigger another request
    service.applicationUser();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(applicationUser);

    expect(service['_applicationUser']()).toEqual(applicationUser);
    expect(result()).toEqual(applicationUser);
    expect(service.userCheckInProgress()).toBe(false);
  });

  it('should reset userCheckInProgress when the application user request fails', () => {
    service.applicationUser();
    expect(service.userCheckInProgress()).toBe(true);

    const req = httpMock.expectOne(`${service['_apiEndpoint']}`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(service.userCheckInProgress()).toBe(false);
    expect(service.applicationUser()).toBeNull();
    // a new check is started because there is still no user
    httpMock.expectOne(`${service['_apiEndpoint']}`).flush(null);
  });

  it('should allow reading the application user inside a computed without throwing', () => {
    const isLoggedIn = computed(() => !!service.applicationUser());
    expect(isLoggedIn()).toBe(false);
    httpMock.expectOne(`${service['_apiEndpoint']}`).flush(null);
  });

  it('should get user notifications', () => {
    const userNotifications: UserNotification[] = [
      { state: NotificationState.Seen, teamInfo: null, invitingUser: null, sent: '2021-01-01T00:00:00.000Z' },
      { state: NotificationState.Accepted, teamInfo: null, invitingUser: null, sent: '2021-01-01T00:00:00.000Z' }
    ];

    const result = service.userNotifications;

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/usernotifications`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush(userNotifications);

    expect(service['_userNotifications']()).toEqual(userNotifications);
    expect(result()).toEqual(userNotifications);
  });

  it('should request user notifications once while a request is in flight', () => {
    service.userNotifications();
    service.userNotifications();

    httpMock.expectOne(`${service['_apiEndpoint']}/usernotifications`).flush([]);
    expect(service.userNotifications()).toEqual([]);
    httpMock.expectNone(`${service['_apiEndpoint']}/usernotifications`);
  });

  it('should retry user notifications after a failed request', () => {
    service.userNotifications();
    httpMock.expectOne(`${service['_apiEndpoint']}/usernotifications`).error(new ProgressEvent('error'), { status: 500 });

    service.userNotifications();
    httpMock.expectOne(`${service['_apiEndpoint']}/usernotifications`).flush([]);
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
    expect(service['_applicationUser']()).toEqual(applicationUser);

    const req2 = httpMock.expectOne(`${service['_apiBase']}/tournament/registrations`);
    expect(req2.request.method).toEqual('GET');
    expect(req2.request.withCredentials).toEqual(true);
    req2.flush(registrations);
    expect(service['_registrations']()).toEqual(registrations);
  });

  it('should logout', () => {
    service['_applicationUser'].set({ id: '1' } as ApplicationUser);
    service.logout().subscribe();
    commsService.success.subscribe(success => expect(success).toBe('Logged out successfully!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/logout`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
    expect(service['_applicationUser']()).toBeNull();
    expect(service['_teamsAdmin']()).toBeNull();
    expect(service['_userNotifications']()).toBeNull();
    expect(service['_registrations']()).toBeNull();
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
    service['_applicationUser'].set({ id: userId } as ApplicationUser);
    service.deleteAccount(userId).subscribe();
    commsService.success.subscribe(success => expect(success).toBe('Account deleted!'));

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/delete?userid=${userId}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
    expect(service['_applicationUser']()).toBeNull();
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

  it('should send the user to the login provider and back to the current page', () => {
    const page = window.location.href.split('#')[0];
    service.login({ name: 'Steam', url: `${page}#external?provider=Steam`, state: '' });

    expect(window.location.hash).toBe(`#external?provider=Steam&returnUrl=${page}`);
    window.location.hash = '';
  });

  it('should report a failed logout and keep the user', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));
    service['_applicationUser'].set({ id: '1' } as ApplicationUser);

    service.logout().subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/logout`).flush('', { status: 500, statusText: 'Server Error' });

    expect(errors.length).toBe(1);
    expect(service['_applicationUser']()).toEqual({ id: '1' });
  });

  it('should report a failed newsletter subscription', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));

    service.addSubscriber('test-email').subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/account/subscribe`).flush('', { status: 500, statusText: 'Server Error' });

    expect(errors.length).toBe(1);
  });

  it('should report the server message when the login is rejected', () => {
    const errors: string[] = [];
    commsService.error.subscribe(message => errors.push(message));

    service.loginWithForm({ username: 'u', password: 'p', rememberMe: false }).subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/login`).flush('Account locked.', { status: 401, statusText: 'Unauthorized' });
    service.loginWithForm({ username: 'u', password: 'p', rememberMe: false }).subscribe({ error: () => undefined });
    httpMock.expectOne(`${service['_apiEndpoint']}/login`).flush('', { status: 401, statusText: 'Unauthorized' });

    expect(errors).toEqual(['Account locked.', 'Login failed. Please check your credentials and try again.']);
    expect(service['_applicationUser']()).toBeNull();
  });

});

describe('LoginService push notifications', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;
  let router: Router;
  let messages: Subject<unknown>;
  let clicks: Subject<{ action: string; notification: { data: unknown } }>;
  let swPush: { isEnabled: boolean; requestSubscription: ReturnType<typeof vi.fn>; messages: Subject<unknown>; notificationClicks: Subject<unknown> };
  const user = { id: '1', username: 'test-user' } as ApplicationUser;
  const subscription = { endpoint: 'https://push.example.com/1' } as PushSubscription;
  // The subscription request resolves a promise, so its follow-up runs on a later tick
  const settle = () => new Promise(resolve => setTimeout(resolve));

  const configure = (enabled: boolean, request: Promise<PushSubscription>) => {
    messages = new Subject();
    clicks = new Subject();
    swPush = { isEnabled: enabled, requestSubscription: vi.fn().mockReturnValue(request), messages, notificationClicks: clicks };
    TestBed.configureTestingModule({
      providers: [
        { provide: SwPush, useValue: swPush },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
    router = TestBed.inject(Router);
  };

  const logIn = async () => {
    service.applicationUser();
    httpMock.expectOne(`${service['_apiEndpoint']}`).flush(user);
    await settle();
  };

  afterEach(() => {
    httpMock.verify();
  });

  it('should subscribe the logged in user to push notifications', async () => {
    configure(true, Promise.resolve(subscription));

    await logIn();

    expect(swPush.requestSubscription).toHaveBeenCalledWith({ serverPublicKey: expect.any(String) });
    const req = httpMock.expectOne(`${service['_apiBase']}/push/subscribe`);
    expect(req.request.body).toEqual(subscription);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should show a pushed message and reload the user', async () => {
    configure(true, Promise.resolve(subscription));
    await logIn();
    httpMock.expectOne(`${service['_apiBase']}/push/subscribe`).flush({});
    const shown: string[] = [];
    commsService.message.subscribe(message => shown.push(message));

    messages.next({ notification: { title: 'You were invited to a team' } });
    const updated = { ...user, username: 'renamed' };
    httpMock.expectOne(`${service['_apiEndpoint']}`).flush(updated);

    expect(shown).toEqual(['You were invited to a team']);
    expect(service.applicationUser()).toEqual(updated);
  });

  it('should open the page a clicked notification points to', async () => {
    configure(true, Promise.resolve(subscription));
    await logIn();
    httpMock.expectOne(`${service['_apiBase']}/push/subscribe`).flush({});
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const open = vi.spyOn(window, 'open').mockReturnValue(null);

    clicks.next({ action: 'viewteam', notification: { data: 'team-1' } });
    clicks.next({ action: 'viewuser', notification: { data: 'user-1' } });
    clicks.next({ action: 'viewstrategy', notification: { data: 'strat-1' } });
    clicks.next({ action: 'checkin', notification: { data: { callbackUrl: 'https://checkin.example.com' } } });
    clicks.next({ action: '', notification: { data: null } });

    expect(navigate.mock.calls).toEqual([
      [['team', 'team-1']],
      [['players', 'user-1']],
      [['strategies', 'details', 'strat-1']]
    ]);
    expect(open).toHaveBeenCalledExactlyOnceWith('https://checkin.example.com', '_blank');
    open.mockRestore();
  });

  it('should keep working when the browser refuses push notifications', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    configure(true, Promise.reject(new Error('Permission denied')));

    await logIn();

    httpMock.expectNone(`${service['_apiBase']}/push/subscribe`);
    expect(log).toHaveBeenCalledWith(new Error('Permission denied'));
    expect(service.applicationUser()).toEqual(user);
    log.mockRestore();
  });

  it('should not ask for push notifications without a service worker', async () => {
    configure(false, Promise.resolve(subscription));

    await logIn();

    expect(swPush.requestSubscription).not.toHaveBeenCalled();
    httpMock.expectNone(`${service['_apiBase']}/push/subscribe`);
  });
});
