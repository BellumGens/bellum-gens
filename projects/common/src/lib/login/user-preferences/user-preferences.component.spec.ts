import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPreferencesComponent } from './user-preferences.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ApplicationUser, CommunicationService, LoginProvider, LoginService, TournamentApplication } from '../../../public_api';
import { Game, TournamentApplicationState } from '../../../models/tournament';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { IgxSwitchComponent } from '@infragistics/igniteui-angular/switch';
import { ConfirmComponent } from '../../confirm/confirm.component';


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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        UserPreferencesComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    authService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    req.flush(applicationUser);
    // re-render so the registrations are pulled for the logged in user
    TestBed.tick();
    const req2 = httpMock.expectOne(`${authService['_apiBase']}/tournament/registrations`);
    req2.flush(registrations);
    const req3 = httpMock.expectOne(`${authService['_apiEndpoint']}/ExternalLogins?returnUrl=%2F`);
    req3.flush(providers);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default preferences', () => {
    expect(component.authUser()).toBe(applicationUser);
    expect(component.preferences()).toEqual({ searchVisible: false, email: 'test-email' });
  });

  it('should have providers', () => {
    expect(component.providers()).toEqual(providers);
  });

  it('should have registrations', () => {
    expect(component.registrations()).toEqual(registrations);
    expect(authService['_registrations']()).toEqual(registrations);
  });

  it('should call login method', () => {
    vi.spyOn(authService, 'login').mockImplementation(() => undefined);
    component.login(providers[0]);
    expect(authService.login).toHaveBeenCalledWith(providers[0]);
  });

  it('should call submitPreferences method', () => {
    commsService.success.subscribe(message => expect(message).toEqual('Preferences updated successfully!'));
    component.submitPreferences();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}/userinfo`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(component.preferences());
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    commsService.error.subscribe(message => expect(message).toEqual(`Http failure response for ${authService['_apiEndpoint']}/userinfo: 500 Something went wrong!`));
    component.submitPreferences();
    const req2 = httpMock.expectOne(`${authService['_apiEndpoint']}/userinfo`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(component.preferences());
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Something went wrong!' });
  });

  it('should update the preferences signal on search visibility change', () => {
    expect(component.preferences().searchVisible).toBe(false);

    component.setSearchVisible(true);
    expect(component.preferences()).toEqual({ searchVisible: true, email: 'test-email' });

    const req = httpMock.expectOne(`${authService['_apiEndpoint']}/userinfo`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ searchVisible: true, email: 'test-email' });
    req.flush({});
  });

  it('should call deleteAccount method', () => {
    commsService.success.subscribe(message => expect(message).toEqual('Account deleted!'));
    component.deleteAccount();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
    // a successful deletion logs the user out
    expect(component.authUser()).toBeNull();

    // log the user back in to exercise the error path
    authService['_applicationUser'].set(applicationUser);
    commsService.error.subscribe(message => expect(message).toEqual(`Http failure response for ${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}: 500 Something went wrong!`));
    component.deleteAccount();
    const req2 = httpMock.expectOne(`${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}`);
    expect(req2.request.method).toBe('DELETE');
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Something went wrong!' });
  });

  it('should call deleteRegistration method', () => {
    expect(component.registrations()).toEqual(registrations);
    expect(authService['_registrations']()).toEqual(registrations);

    const registration = registrations[0];
    const remaining = registrations[1];
    commsService.success.subscribe(message => expect(message).toEqual('Tournament application deleted successfully!'));
    component.deleteRegistration(registration);
    const req2 = httpMock.expectOne(`${authService['_apiBase']}/tournament/delete?id=${registration.id}`);
    expect(req2.request.method).toBe('DELETE');
    expect(req2.request.withCredentials).toBe(true);
    req2.flush({});
    expect(component.registrations()).toEqual([remaining]);
    expect(authService['_registrations']()).toEqual([remaining]);

    commsService.error.subscribe(message => expect(message).toEqual(`Http failure response for ${authService['_apiBase']}/tournament/delete?id=${registration.id}: 500 Something went wrong!`));
    component.deleteRegistration(registration);
    const req3 = httpMock.expectOne(`${authService['_apiBase']}/tournament/delete?id=${registration.id}`);
    expect(req3.request.method).toBe('DELETE');
    expect(req3.request.withCredentials).toBe(true);
    req3.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Something went wrong!' });
  });

  it('should emit userDeleted after the account is deleted', () => {
    const emitSpy = vi.spyOn(component.userDeleted, 'emit');
    component.deleteAccount();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}`);
    req.flush({});
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should confirm the registration on weekly checkin', () => {
    const registration = registrations[0];
    component.weeklyCheckin(registration);
    const req = httpMock.expectOne(`${authService['_apiBase']}/tournament/checkin?id=${registration.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
    expect(component.registrations()[0].state).toBe(TournamentApplicationState.Confirmed);
    expect(component.registrations()[1].state).toBe(TournamentApplicationState.Pending);
    expect(authService['_registrations']()[0].state).toBe(TournamentApplicationState.Confirmed);

    fixture.detectChanges();
    const states = fixture.nativeElement.querySelectorAll('[igxListAction] > span');
    expect(states[0].classList).toContain('color-success');
    expect(states[1].classList).toContain('color-error');
  });

  it('should render the registration actions as named buttons', () => {
    fixture.detectChanges();
    const actions = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('igx-list-item')[0].querySelectorAll('[igxListAction] button'));

    expect(actions.map(b => b.type)).toEqual(['button', 'button']);
    expect(actions.map(b => b.getAttribute('aria-label'))).toEqual(['Check in', 'Delete this application']);

    actions[0].click();
    const req = httpMock.expectOne(`${authService['_apiBase']}/tournament/checkin?id=${registrations[0].id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should open the registration from a button', () => {
    vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    const button = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Create username and password');

    expect(button.type).toBe('button');
    button.click();

    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it('disableLogin should return true for externalLogins on the authUser', () => {
    expect(component.disableLogin('BattleNet')).toBe(false);
    expect(component.disableLogin('Steam')).toBe(true);
  });

  it('should call openRegistration method', () => {
    vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.openRegistration();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  describe('in the page', () => {
    const el = (): HTMLElement => fixture.nativeElement;
    const buttons = () => Array.from<HTMLButtonElement>(el().querySelectorAll('button'));
    const adminUrl = () => `${authService['_apiBase']}/admin/tournamentadmin`;

    it('should offer to add the logins the user does not have yet', () => {
      fixture.detectChanges();
      vi.spyOn(authService, 'login').mockImplementation(() => undefined);
      const loginButtons = buttons().filter(b => b.querySelector('igx-icon[family="login-icons"]'));

      expect(loginButtons.map(b => b.querySelector('span').textContent.trim())).toEqual(['Steam', 'Add BattleNet']);
      expect(loginButtons.map(b => b.disabled)).toEqual([true, false]);
      expect(loginButtons[0].querySelector('.color-success').textContent).toBe('done');

      loginButtons[1].click();

      expect(authService.login).toHaveBeenCalledWith(providers[1]);
    });

    it('should not mark any login as added once logged out', () => {
      authService['_applicationUser'].set(null);

      expect(component.disableLogin('Steam')).toBe(false);
    });

    it('should save the search visibility when the switch is toggled', async () => {
      await fixture.whenStable();
      const visibility = fixture.debugElement.query(By.directive(IgxSwitchComponent));
      expect((visibility.componentInstance as IgxSwitchComponent).checked).toBe(false);

      visibility.nativeElement.querySelector('input[type="checkbox"]').click();

      const req = httpMock.expectOne(`${authService['_apiEndpoint']}/userinfo`);
      expect(req.request.body).toEqual({ searchVisible: true, email: 'test-email' });
      req.flush({});
      expect(component.preferences().searchVisible).toBe(true);
    });

    it('should offer the tournament administration to tournament admins only', () => {
      fixture.detectChanges();
      expect(buttons().some(b => b.textContent.includes('SC2 Tournament Admin'))).toBe(false);

      httpMock.expectOne(adminUrl()).flush(true);
      fixture.detectChanges();

      const admin = buttons().find(b => b.textContent.includes('SC2 Tournament Admin'));
      expect(admin).toBeTruthy();
      vi.spyOn(router, 'navigate');
      // Outside the league site the admin is opened there instead of navigating within this app
      admin.click();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should name the state of every registration, pending when it has none', () => {
      authService['_registrations'].set([
        { ...registrations[0], state: TournamentApplicationState.Confirmed },
        { ...registrations[1], state: TournamentApplicationState.Banned },
        { ...registrations[1], id: '3', state: undefined }
      ]);
      fixture.detectChanges();

      const states = Array.from(el().querySelectorAll('[igxListAction] > span')).map(s => `${s.className}:${s.textContent}`);
      expect(states).toEqual(['color-success:Confirmed', 'color-warn:Banned', ':Pending']);
      // Only a registration without a state can still be checked in or withdrawn
      expect(el().querySelectorAll('igx-list-item')[2].querySelectorAll('[igxListAction] button').length).toBe(2);
      expect(el().querySelectorAll('igx-list-item')[0].querySelectorAll('[igxListAction] button').length).toBe(0);
    });

    it('should not check in a banned registration', () => {
      component.weeklyCheckin({ ...registrations[0], state: TournamentApplicationState.Banned });

      httpMock.expectNone(`${authService['_apiBase']}/tournament/checkin?id=${registrations[0].id}`);
    });

    it('should keep the registration when the check in fails', () => {
      component.weeklyCheckin(registrations[0]);
      httpMock.expectOne(`${authService['_apiBase']}/tournament/checkin?id=${registrations[0].id}`)
        .flush('', { status: 500, statusText: 'Server Error' });

      expect(component.registrations()[0].state).toBe(TournamentApplicationState.Pending);
    });

    it('should ask for confirmation before deleting a registration and delete it on ok', () => {
      fixture.detectChanges();
      const [confirmAccount, confirmReg] = fixture.debugElement.queryAll(By.directive(ConfirmComponent));
      const open = vi.spyOn(confirmReg.componentInstance as ConfirmComponent, 'open').mockImplementation(() => undefined);

      el().querySelectorAll<HTMLButtonElement>('igx-list-item')[0].querySelector<HTMLButtonElement>('button[aria-label="Delete this application"]').click();
      expect(open).toHaveBeenCalledWith(registrations[0]);

      confirmReg.triggerEventHandler('ok', registrations[0]);
      httpMock.expectOne(`${authService['_apiBase']}/tournament/delete?id=${registrations[0].id}`).flush({});

      expect(component.registrations().map(r => r.id)).toEqual(['2']);
      expect(confirmAccount).toBeTruthy();
    });

    it('should ask for confirmation before deleting the account and delete it on ok', () => {
      fixture.detectChanges();
      const confirmAccount = fixture.debugElement.queryAll(By.directive(ConfirmComponent))[0];
      const open = vi.spyOn(confirmAccount.componentInstance as ConfirmComponent, 'open').mockImplementation(() => undefined);
      const deleted = vi.fn();
      component.userDeleted.subscribe(deleted);

      buttons().find(b => b.textContent.includes('Delete Account Forever')).click();
      expect(open).toHaveBeenCalled();

      confirmAccount.triggerEventHandler('ok');
      httpMock.expectOne(`${authService['_apiEndpoint']}/delete?userid=${applicationUser.id}`).flush({});

      expect(deleted).toHaveBeenCalled();
    });
  });
});
