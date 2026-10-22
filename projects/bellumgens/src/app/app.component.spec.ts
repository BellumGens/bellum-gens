import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { Component, LOCALE_ID, PLATFORM_ID, Provider, output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IgxBannerComponent } from '@infragistics/igniteui-angular/banner';
import { IgxNavigationDrawerComponent } from '@infragistics/igniteui-angular/navigation-drawer';
import { BannerResourceStringsEN, changei18n, getCurrentResourceStrings } from '@infragistics/igniteui-angular/core';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';
import {
  ApplicationUser,
  CSGOTeam,
  CommunicationService,
  NotificationState,
  SearchResult,
  UserNotification
} from '../../../common/src/public_api';
import { environment } from '../../../common/src/environments/environment';

const authUser = { id: 'user-1', username: 'TestUser' } as ApplicationUser;

const team = (teamId: string): CSGOTeam => ({ teamId, teamName: teamId, teamAvatar: '', visible: true });

const notification = (state: NotificationState): UserNotification => ({
  state,
  teamInfo: team('team'),
  invitingUser: null,
  sent: ''
});

const emptySearch: SearchResult = { steamUser: null, players: [], teams: [], strategies: [] };

/** Stands in for the routed notifications view, which reports the unread count it shows. */
@Component({ template: '' })
class NotificationsViewStubComponent {
  public unreadChanged = output<number>();
}

@Component({ template: '' })
class OtherViewStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  let iconService: IgxIconService;
  const el = (): HTMLElement => fixture.nativeElement;

  const userUrl = environment.authApiEndpoint;
  const teamsUrl = `${environment.apiEndpoint}/users/userteams?userid=${authUser.id}`;
  const notificationsUrl = `${environment.authApiEndpoint}/usernotifications`;
  const searchUrl = (name: string) => `${environment.apiEndpoint}/search?name=${name}`;
  const loginProvidersUrl = `${environment.authApiEndpoint}/ExternalLogins?returnUrl=%2F`;

  const configure = async (providers: Provider [] = []) => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        AppComponent
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...providers
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    iconService = TestBed.inject(IgxIconService);
    vi.spyOn(iconService, 'addSvgIcon').mockImplementation(() => undefined);
    vi.spyOn(iconService, 'addSvgIconFromText').mockImplementation(() => undefined);
  };

  const create = async () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    // The login buttons in the navbar load the external login providers.
    httpMock.expectOne(loginProvidersUrl).flush([]);
    await fixture.whenStable();
  };

  /** Answers the lazy "who is logged in" check made by the app shell and the login component. */
  const flushUser = async (user: ApplicationUser) => {
    httpMock.expectOne(userUrl).flush(user);
    await fixture.whenStable();
  };

  /** Logs `authUser` in and answers the teams and notifications requests that follow. */
  const login = async (teams: CSGOTeam [], notifications: UserNotification []) => {
    await flushUser(authUser);
    httpMock.expectOne(teamsUrl).flush(teams);
    httpMock.expectOne(notificationsUrl).flush(notifications);
    // The user preferences in the login drop down load their own data once a user is known.
    httpMock.expectOne(loginProvidersUrl).flush([]);
    httpMock.expectOne(`${environment.apiEndpoint}/admin/tournamentadmin`).flush(false);
    httpMock.expectOne(`${environment.apiEndpoint}/tournament/registrations`).flush([]);
    await fixture.whenStable();
  };

  const drawerItem = (link: string) => el().querySelector<HTMLElement>(`igx-nav-drawer [igxDrawerItem][routerLink="${link}"]`);
  const badgeValue = (link: string) => drawerItem(link)?.querySelector('igx-badge')?.textContent.trim();
  const searchInput = (): HTMLInputElement => el().querySelector('#searchInput');

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    httpMock.verify();
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await configure();
      await create();
    });

    it('should create the app', async () => {
      expect(component).toBeTruthy();
      await flushUser(null);
    });

    it('should register the login, health, partner and language icons', async () => {
      await flushUser(null);

      expect(iconService.addSvgIconFromText).toHaveBeenCalledWith('steam', expect.any(String), 'login-icons', true);
      expect(iconService.addSvgIconFromText).toHaveBeenCalledWith('discord', expect.any(String), 'login-icons', true);
      expect(iconService.addSvgIconFromText).toHaveBeenCalledWith('heart-care', expect.any(String), 'health-icons');
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('bg-logo', '/assets/bg-logo.svg', 'partners');
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('en', '/assets/country-flags/svg/united-kingdom.svg', 'languages');
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('bg', '/assets/country-flags/svg/bulgaria.svg', 'languages');
    });

    it('should render the footer with the current year', async () => {
      await flushUser(null);

      expect(el().querySelector('footer').textContent).toContain(`Copyright © Bellum Gens, 2019-${component.year}`);
    });

    describe('without a logged in user', () => {
      beforeEach(async () => {
        await flushUser(null);
      });

      it('should only render the public navigation items', () => {
        expect(component.authUser()).toBeNull();
        expect(drawerItem('team/myteams')).toBeNull();
        expect(drawerItem('notifications')).toBeNull();
        expect(drawerItem('strategies/user')).toBeNull();
        expect(drawerItem('bellumgenselite')).not.toBeNull();
        expect(drawerItem('tournaments')).not.toBeNull();
      });

      it('should not request the teams or notifications', () => {
        httpMock.expectNone(req => req.url.includes('/users/userteams'));
        httpMock.expectNone(notificationsUrl);
        expect(component.teams()).toBeNull();
        expect(component.unreadNotifications()).toBe(0);
      });
    });

    describe('with a logged in user', () => {
      it('should render the user navigation items with team and unread notification badges', async () => {
        await login(
          [team('t1'), team('t2')],
          [notification(NotificationState.NotSeen), notification(NotificationState.Seen), notification(NotificationState.NotSeen)]
        );

        expect(component.teams().length).toBe(2);
        expect(component.unreadNotifications()).toBe(2);
        expect(drawerItem('strategies/user')).not.toBeNull();
        expect(badgeValue('team/myteams')).toBe('2');
        expect(badgeValue('notifications')).toBe('2');
      });

      it('should not render badges when the user has no teams or unread notifications', async () => {
        await login([], [notification(NotificationState.Seen)]);

        expect(drawerItem('team/myteams')).not.toBeNull();
        expect(drawerItem('notifications')).not.toBeNull();
        expect(badgeValue('team/myteams')).toBeUndefined();
        expect(badgeValue('notifications')).toBeUndefined();
      });

      it('should show the unread notifications count reported by the notifications view', async () => {
        await login([], [notification(NotificationState.NotSeen)]);
        expect(badgeValue('notifications')).toBe('1');

        component.notificationsLoaded(3);
        await fixture.whenStable();
        expect(component.unreadNotifications()).toBe(3);
        expect(badgeValue('notifications')).toBe('3');

        component.notificationsLoaded(0);
        await fixture.whenStable();
        expect(component.unreadNotifications()).toBe(0);
        expect(badgeValue('notifications')).toBeUndefined();
      });

      it('should update the badge from the routed notifications view', async () => {
        await login([], [notification(NotificationState.NotSeen), notification(NotificationState.NotSeen)]);
        expect(badgeValue('notifications')).toBe('2');
        const router = TestBed.inject(Router);
        router.resetConfig([
          { path: 'notifications', component: NotificationsViewStubComponent },
          { path: 'other', component: OtherViewStubComponent }
        ]);

        await router.navigateByUrl('/notifications');
        await fixture.whenStable();
        const view = fixture.debugElement.query(By.directive(NotificationsViewStubComponent))
          .componentInstance as NotificationsViewStubComponent;

        view.unreadChanged.emit(1);
        await fixture.whenStable();
        expect(component.unreadNotifications()).toBe(1);
        expect(badgeValue('notifications')).toBe('1');

        view.unreadChanged.emit(0);
        await fixture.whenStable();
        expect(badgeValue('notifications')).toBeUndefined();

        // Other routed views do not touch the badge, which keeps the last reported count
        await router.navigateByUrl('/other');
        await fixture.whenStable();
        expect(fixture.debugElement.query(By.directive(OtherViewStubComponent))).not.toBeNull();
        expect(component.unreadNotifications()).toBe(0);
      });
    });

    describe('search box', () => {
      beforeEach(async () => {
        await flushUser(null);
      });

      it('should track the search term and clear it from the suffix', async () => {
        const input = searchInput();
        expect(el().querySelector('igx-suffix')).toBeNull();

        input.value = 'bellum';
        input.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        expect(component.searchTerm()).toBe('bellum');

        const clear = el().querySelector<HTMLButtonElement>('igx-suffix button');
        expect(clear.type).toBe('button');
        expect(clear.getAttribute('aria-label')).toBe('Clear search');
        clear.click();
        await fixture.whenStable();

        expect(component.searchTerm()).toBe('');
        expect(input.value).toBe('');
        expect(el().querySelector('igx-suffix')).toBeNull();
      });

      it('should open the advanced search banner on focus and hide it from the banner action', async () => {
        const banner = fixture.debugElement.query(By.directive(IgxBannerComponent)).componentInstance as IgxBannerComponent;
        expect(banner.collapsed).toBe(true);

        searchInput().dispatchEvent(new Event('focus'));
        await fixture.whenStable();
        expect(banner.collapsed).toBe(false);
        expect(el().querySelector('igx-banner app-search')).not.toBeNull();

        const hide = Array.from(el().querySelectorAll<HTMLButtonElement>('igx-banner button'))
          .find(b => b.textContent.trim() === 'Hide');
        hide.click();
        await fixture.whenStable();
        expect(banner.collapsed).toBe(true);
      });

      it('should quick search the debounced keyup value and open the results drop down', async () => {
        // Only fake the clock and intervals used by the RxJS debounce, Angular keeps scheduling with real timers.
        vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
        const input = searchInput();

        input.value = 'bel';
        input.dispatchEvent(new KeyboardEvent('keyup'));
        vi.advanceTimersByTime(100);
        input.value = 'bellum';
        input.dispatchEvent(new KeyboardEvent('keyup'));
        vi.advanceTimersByTime(299);
        httpMock.expectNone(searchUrl('bellum'));
        expect(component.quickSearchDropDown().collapsed).toBe(true);

        vi.advanceTimersByTime(1);
        httpMock.expectNone(searchUrl('bel'));
        httpMock.expectOne(searchUrl('bellum')).flush(emptySearch);
        await fixture.whenStable();

        expect(component.quickSearchDropDown().collapsed).toBe(false);
        expect(document.querySelector('app-quick-search').textContent).toContain('No matching players...');
        component.quickSearchDropDown().close();
      });

      it('should not quick search an empty value', async () => {
        // Only fake the clock and intervals used by the RxJS debounce, Angular keeps scheduling with real timers.
        vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
        const input = searchInput();

        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keyup'));
        vi.advanceTimersByTime(300);

        httpMock.expectNone(req => req.url.startsWith(`${environment.apiEndpoint}/search`));
        expect(component.quickSearchDropDown().collapsed).toBe(true);
      });
    });

    it('should show the success message passed through the query params', async () => {
      await flushUser(null);
      const messages: string [] = [];
      TestBed.inject(CommunicationService).success.subscribe(m => messages.push(m));

      await TestBed.inject(Router).navigateByUrl('/?message=Welcome%20back');
      await fixture.whenStable();

      expect(messages).toEqual(['Welcome back']);
      expect(el().querySelector('bg-success-error .msg-container').textContent).toBe('Welcome back');
    });

    it('should ignore query params without a message', async () => {
      await flushUser(null);
      const messages: string [] = [];
      TestBed.inject(CommunicationService).success.subscribe(m => messages.push(m));

      await TestBed.inject(Router).navigateByUrl('/?other=value');
      await fixture.whenStable();

      expect(messages).toEqual([]);
    });

    it('should toggle the navigation drawer from the menu icon', async () => {
      await flushUser(null);
      const drawer = fixture.debugElement.query(By.directive(IgxNavigationDrawerComponent)).componentInstance as IgxNavigationDrawerComponent;
      expect(drawer.isOpen).toBe(false);

      const menu = el().querySelector<HTMLButtonElement>('button.drawer-action');
      expect(menu.type).toBe('button');
      expect(menu.getAttribute('aria-label')).toBe('Navigation menu');
      expect(menu.getAttribute('aria-controls')).toBe('navigation');
      expect(menu.getAttribute('aria-expanded')).toBe('false');

      menu.click();
      await fixture.whenStable();

      expect(drawer.isOpen).toBe(true);
      expect(menu.getAttribute('aria-expanded')).toBe('true');
    });

    it('should render the navigation and the logo as links', async () => {
      await flushUser(null);

      const items = Array.from(el().querySelectorAll<HTMLElement>('igx-nav-drawer [igxDrawerItem]:not(.igx-nav-drawer__item--header)'));
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(item.tagName).toBe('A');
        expect(item.getAttribute('href')).toBeTruthy();
      }
      expect(drawerItem('tournaments').getAttribute('href')).toBe('/tournaments');

      const logo = el().querySelector<HTMLAnchorElement>('igx-navbar a.logo-link');
      expect(logo.getAttribute('href')).toBe('/');
      expect(logo.getAttribute('aria-label')).toBe('Bellum Gens');
    });
  });

  describe('on a wide viewport', () => {
    beforeEach(async () => {
      await configure();
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1700);
      await create();
    });

    it('should pin the drawer and render the mini navigation for a logged in user', async () => {
      await login([team('t1')], [notification(NotificationState.NotSeen)]);

      const drawer = fixture.debugElement.query(By.directive(IgxNavigationDrawerComponent)).componentInstance as IgxNavigationDrawerComponent;
      expect(drawer.pin).toBe(true);
      const titles = Array.from(el().querySelectorAll('igx-nav-drawer [igxDrawerItem][title]')).map(i => i.getAttribute('title'));
      expect(titles).toEqual(['My Teams', 'Notifications', 'My Strategies', 'Bellum Gens Elite', 'BGE Balkan Circuit', 'Tournaments', 'Partners', 'About us']);
      expect(badgeValue('team/myteams')).toBe('1');
      expect(badgeValue('notifications')).toBe('1');
    });

    it('should render the mini navigation without badges or user items as needed', async () => {
      await flushUser(null);

      const titles = Array.from(el().querySelectorAll('igx-nav-drawer [igxDrawerItem][title]')).map(i => i.getAttribute('title'));
      expect(titles).toEqual(['Bellum Gens Elite', 'BGE Balkan Circuit', 'Tournaments', 'Partners', 'About us']);
    });

    it('should hide the mini navigation badges when there is nothing to report', async () => {
      await login([], []);

      expect(drawerItem('team/myteams')).not.toBeNull();
      expect(badgeValue('team/myteams')).toBeUndefined();
      expect(badgeValue('notifications')).toBeUndefined();
    });
  });

  describe('with the Bulgarian locale', () => {
    beforeEach(async () => {
      await configure([{ provide: LOCALE_ID, useValue: 'bg' }]);
      await create();
      await flushUser(null);
    });

    afterEach(() => {
      changei18n(BannerResourceStringsEN);
    });

    it('should switch the Ignite UI resource strings to Bulgarian', () => {
      const banner = getCurrentResourceStrings(BannerResourceStringsEN, false);
      const keys = Object.keys(BannerResourceStringsEN) as (keyof typeof BannerResourceStringsEN) [];

      expect(keys.length).toBeGreaterThan(0);
      keys.forEach(key => expect(banner[key]).toBe(IgxResourceStringsBG[key]));
      expect(banner).not.toEqual(BannerResourceStringsEN);
    });
  });

  describe('on the server', () => {
    beforeEach(async () => {
      await configure([{ provide: PLATFORM_ID, useValue: 'server' }]);
      await create();
    });

    it('should not look up the user, register icons or relay query param messages', async () => {
      const messages: string [] = [];
      TestBed.inject(CommunicationService).success.subscribe(m => messages.push(m));
      // Only the login component asks for the user; the app shell itself never does on the server.
      httpMock.expectOne(userUrl).flush(authUser);
      await fixture.whenStable();
      // The user preferences in the login drop down load their own data for the user.
      httpMock.expectOne(loginProvidersUrl).flush([]);
      httpMock.expectOne(`${environment.apiEndpoint}/admin/tournamentadmin`).flush(false);
      httpMock.expectOne(`${environment.apiEndpoint}/tournament/registrations`).flush([]);
      await fixture.whenStable();

      await TestBed.inject(Router).navigateByUrl('/?message=Hello');
      await fixture.whenStable();

      expect(component.authUser()).toBeNull();
      expect(drawerItem('team/myteams')).toBeNull();
      httpMock.expectNone(req => req.url.includes('/users/userteams'));
      httpMock.expectNone(notificationsUrl);
      expect(iconService.addSvgIcon).not.toHaveBeenCalled();
      expect(iconService.addSvgIconFromText).not.toHaveBeenCalled();
      expect(messages).toEqual([]);
    });
  });
});
