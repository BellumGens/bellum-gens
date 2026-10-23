import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationUser, LoginService } from '../../public_api';
import { Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let authService: LoginService;
  let applicationUser: ApplicationUser = {
    id: '1',
    steamId: 'test-steam-id',
    battleNetId: 'test-battlenet-id',
    username: 'test-user',
    email: 'test-email',
    searchVisible: true,
    steamUserException: false,
    userStatsException: false,
    registered: true,
    csgoDetails: {
      steamUser: null,
      userStats: null,
      headshotPercentage: 50,
      killDeathRatio: 1,
      accuracy: 0.2,
      steamPrivate: false,
      realName: 'Real Name',
      customUrl: '123',
      avatarFull: 'string',
      avatarMedium: 'string',
      avatarIcon: 'string'
    },
    externalLogins: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        LoginComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
    authService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a dialog component which opens when the LoginService emits openLogin', () => {
    expect(component.dialog()).toBeDefined();
    vi.spyOn(component.dialog(), 'openLogin').mockImplementation(() => undefined);
    authService.emitOpenLogin();
    expect(component.dialog().openLogin).toHaveBeenCalled();
  });

  it('should have a userProfile component after authUser is set', () => {
    expect(component.userProfile()).toBeUndefined();
    // the component triggers the user check on creation
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    req.flush(applicationUser);
    expect(component.authUser()).toBe(applicationUser);
    fixture.detectChanges();
    expect(component.userProfile()).toBeDefined();
  });

  it('should have userCheck when a request in currently pending', () => {
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    expect(component.userCheck()).toBe(true);
    req.flush(applicationUser);
    expect(component.userCheck()).toBe(false);
    expect(component.authUser()).toBe(applicationUser);
  });

  it('should call logout method', () => {
    let req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    req.flush(applicationUser);
    expect(component.authUser()).toBe(applicationUser);
    fixture.detectChanges();

    const userProfile = component.userProfile();
    vi.spyOn(userProfile, 'close').mockImplementation(() => undefined);
    component.logout();
    req = httpMock.expectOne(`${authService['_apiEndpoint']}/logout`);
    req.flush({});
    expect(userProfile.close).toHaveBeenCalled();
    expect(component.authUser()).toBeNull();
  });

  it('navigateToProfile method should call router.navigate with correct params', () => {
    vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.navigateToProfile(applicationUser);
    expect(router.navigate).toHaveBeenCalledWith(['/players/', applicationUser.csgoDetails.customUrl]);
  });

  describe('rendering', () => {
    const sc2User: ApplicationUser = {
      ...applicationUser,
      csgoDetails: undefined,
      sc2Details: {
        battleNetId: 'sc2-id',
        battleNetBattleTag: 'Player#1234',
        avatarUrl: 'sc2-avatar',
        profileUrl: 'sc2-profile',
        regionId: 1,
        realmId: 1
      }
    };

    const logIn = async (user: ApplicationUser) => {
      httpMock.expectOne(`${authService['_apiEndpoint']}`).flush(user);
      await fixture.whenStable();
    };
    const profileButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button.profile-button');
    const avatars = () => fixture.debugElement.queryAll(By.directive(IgxAvatarComponent)).map(de => de.componentInstance as IgxAvatarComponent);
    // The profile drop down only renders its content while open, inside the overlay attached to the document.
    const openProfile = async () => {
      profileButton().click();
      await fixture.whenStable();
    };
    const profileUsername = (): HTMLElement => document.querySelector('h1.profile-username');
    const profileLink = (): HTMLButtonElement => profileUsername().querySelector('button');
    const profileSubtitle = (): string => document.querySelector('[igxCardHeaderSubtitle]').textContent.trim();

    afterEach(() => {
      component.close();
    });

    it('should render the login button when there is no user', async () => {
      httpMock.expectOne(`${authService['_apiEndpoint']}`).flush(null);
      await fixture.whenStable();

      expect(component.userCheck()).toBe(false);
      expect(fixture.nativeElement.querySelector('button.login-button-button')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('igx-circular-bar')).toBeNull();
      expect(profileButton()).toBeNull();
      expect(component.userProfile()).toBeUndefined();
    });

    it('should name the login button, whose text is hidden on narrow screens', async () => {
      httpMock.expectOne(`${authService['_apiEndpoint']}`).flush(null);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('button.login-button-button').getAttribute('aria-label')).toBe('login');
    });

    it('should open the login dialog when the login button is clicked', async () => {
      httpMock.expectOne(`${authService['_apiEndpoint']}`).flush(null);
      await fixture.whenStable();

      fixture.nativeElement.querySelector('button.login-button-button').click();
      await fixture.whenStable();

      expect(component.dialog().dialog().isOpen).toBe(true);
      component.dialog().dialog().close();
    });

    it('should render the login button again when the user check fails', async () => {
      httpMock.expectOne(`${authService['_apiEndpoint']}`).error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(component.authUser()).toBeNull();
      expect(fixture.nativeElement.querySelector('button.login-button-button')).not.toBeNull();
    });

    it('should render a progress indicator while the user check is in progress', async () => {
      await fixture.whenStable();

      expect(component.userCheck()).toBe(true);
      expect(fixture.nativeElement.querySelector('igx-circular-bar')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('button.login-button-button')).toBeNull();
      expect(profileButton()).toBeNull();
    });

    it('should render the CS:GO avatar of the logged in user in the profile button', async () => {
      await logIn(applicationUser);

      expect(fixture.nativeElement.querySelector('igx-circular-bar')).toBeNull();
      expect(profileButton().getAttribute('title')).toBe('Profile');
      expect(profileButton().getAttribute('aria-label')).toBe('Profile');
      const [avatar] = avatars();
      expect(avatar.src).toBe(applicationUser.csgoDetails.avatarMedium);
      expect(avatar.initials).toBe(applicationUser.username);
    });

    it('should render the CS:GO profile of the logged in user', async () => {
      const user: ApplicationUser = { ...applicationUser, csgoDetails: { ...applicationUser.csgoDetails, avatarFull: 'full-avatar' } };
      await logIn(user);

      await openProfile();

      expect(component.userProfile().collapsed).toBe(false);
      expect(avatars()[1].src).toBe('full-avatar');
      expect(profileUsername().textContent.trim()).toBe(user.username);
      expect(profileSubtitle()).toBe(user.csgoDetails.realName);
    });

    it('should render the StarCraft II profile of the logged in user', async () => {
      await logIn(sc2User);

      expect(avatars()[0].src).toBe('sc2-avatar');
      await openProfile();

      expect(avatars()[1].src).toBe('sc2-avatar');
      expect(profileSubtitle()).toBe('Player#1234');
    });

    it('should render an initials avatar for a user without game details', async () => {
      await logIn({ ...applicationUser, csgoDetails: undefined });

      expect(avatars()[0].src).toBe('');
      expect(avatars()[0].initials).toBe(applicationUser.username);
      await openProfile();

      expect(avatars()[1].src).toBe('');
      expect(profileSubtitle()).toBe('');
    });

    it('should navigate to the CS:GO player profile when the username is clicked', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      await logIn(applicationUser);
      await openProfile();

      expect(profileLink().type).toBe('button');
      profileLink().click();

      expect(navigate).toHaveBeenCalledWith(['/players/', applicationUser.csgoDetails.customUrl]);
    });

    it('should navigate to the StarCraft II player profile when the username is clicked', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      await logIn(sc2User);
      await openProfile();

      expect(profileLink().type).toBe('button');
      profileLink().click();

      expect(navigate).toHaveBeenCalledWith(['/players/', 'sc2-id']);
    });

    it('should log out and close the profile when the logout button is clicked', async () => {
      await logIn(applicationUser);
      await openProfile();

      const logoutButton = Array.from(document.querySelectorAll<HTMLButtonElement>('igx-tab-content button'))
        .find(b => b.textContent.includes('logout'));
      expect(logoutButton.classList).toContain('submit-button');
      expect(logoutButton.classList).toContain('profile-username');
      logoutButton.click();
      const req = httpMock.expectOne(`${authService['_apiEndpoint']}/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
      await fixture.whenStable();

      expect(component.authUser()).toBeNull();
      expect(fixture.nativeElement.querySelector('button.login-button-button')).not.toBeNull();
      expect(profileButton()).toBeNull();
    });

    it('should close the profile when the user deletes the account', async () => {
      await logIn(applicationUser);
      await openProfile();
      // The preferences live in the second, lazily rendered tab.
      document.querySelectorAll<HTMLElement>('igx-tab-header')[1].click();
      await fixture.whenStable();
      const preferences = fixture.debugElement.query(By.directive(UserPreferencesComponent));

      preferences.componentInstance.userDeleted.emit();
      await fixture.whenStable();

      expect(component.userProfile().collapsed).toBe(true);
    });

    it('should not fail closing the profile when no user is logged in', () => {
      httpMock.expectOne(`${authService['_apiEndpoint']}`).flush(null);

      expect(() => component.close()).not.toThrow();
    });
  });

  describe('navigateToProfile', () => {
    let navigate: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('should not navigate for a user without game details', () => {
      component.navigateToProfile({ ...applicationUser, csgoDetails: undefined });

      expect(navigate).not.toHaveBeenCalled();
    });

    describe('outside of the Bellum Gens app', () => {
      let location: { href: string };

      beforeEach(() => {
        // jsdom does not implement navigation, so the location the component reads and writes is stubbed.
        location = { href: 'http://localhost:4201/tournaments' };
        vi.stubGlobal('location', location);
      });

      afterEach(() => {
        vi.unstubAllGlobals();
      });

      it('should redirect to the CS:GO player profile in the Bellum Gens app', () => {
        component.navigateToProfile(applicationUser);

        expect(navigate).not.toHaveBeenCalled();
        expect(location.href).toBe(`http://localhost:4200/players/${applicationUser.csgoDetails.customUrl}`);
      });

      it('should redirect to the StarCraft II player profile in the Bellum Gens app', () => {
        component.navigateToProfile({ ...applicationUser, csgoDetails: undefined, sc2Details: { battleNetId: 'sc2-id' } as ApplicationUser['sc2Details'] });

        expect(navigate).not.toHaveBeenCalled();
        expect(location.href).toBe('http://localhost:4200/players/sc2-id');
      });

      it('should not redirect for a user without game details', () => {
        component.navigateToProfile({ ...applicationUser, csgoDetails: undefined });

        expect(location.href).toBe('http://localhost:4201/tournaments');
      });
    });
  });
});
