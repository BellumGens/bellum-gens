import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { IgxNavigationDrawerComponent } from '@infragistics/igniteui-angular/navigation-drawer';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import {
  ActionStripResourceStringsEN, BannerResourceStringsEN, CalendarResourceStringsEN, CarouselResourceStringsEN, ChipResourceStringsEN,
  ComboResourceStringsEN, DatePickerResourceStringsEN, DateRangePickerResourceStringsEN, GridResourceStringsEN, InputResourceStringsEN,
  ListResourceStringsEN, PaginatorResourceStringsEN, QueryBuilderResourceStringsEN, TimePickerResourceStringsEN, TreeResourceStringsEN,
  changei18n, getCurrentResourceStrings
} from '@infragistics/igniteui-angular/core';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';
import { heartCare } from '@igniteui/material-icons-extended';
import { ApplicationUser, CommunicationService, LoginService } from '../../../common/src/public_api';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;
  let successes: string [];

  const el = (): HTMLElement => fixture.nativeElement;
  const drawer = () => fixture.debugElement.query(By.directive(IgxNavigationDrawerComponent)).componentInstance as IgxNavigationDrawerComponent;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const create = (options: { platform?: string, locale?: string } = {}) => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        AppComponent
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: options.platform ?? 'browser' },
        { provide: LOCALE_ID, useValue: options.locale ?? 'en' }
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    loginService = TestBed.inject(LoginService);
    successes = [];
    TestBed.inject(CommunicationService).success.subscribe(message => successes.push(message));

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  // The language flags are fetched by the icon service
  const flushFlags = () => httpMock.match(req => req.url.endsWith('.svg')).map(req => {
    req.flush('<svg></svg>');
    return req.request.url;
  });

  // The login button looks up the logged in user and the external login providers on every platform
  const flushUserCheck = (user: ApplicationUser = null) => {
    httpMock.expectOne(loginService['_apiEndpoint']).flush(user);
    httpMock.expectOne(`${loginService['_apiEndpoint']}/ExternalLogins?returnUrl=%2F`).flush([]);
  };

  afterEach(() => {
    httpMock.verify();
  });

  describe('in the browser', () => {
    beforeEach(() => create());

    it('should create the app', () => {
      flushFlags();
      flushUserCheck();

      expect(component).toBeTruthy();
    });

    it('should register the social, health and language icons', () => {
      const iconService = TestBed.inject(IgxIconService);
      flushUserCheck();

      ['discord', 'steam', 'twitch', 'battlenet', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube']
        .forEach(name => expect(iconService.isSvgIconCached(name, 'login-icons')).toBe(true));
      expect(iconService.isSvgIconCached(heartCare.name, 'health-icons')).toBe(true);

      expect(flushFlags()).toEqual([
        '/assets/country-flags/svg/united-kingdom.svg',
        '/assets/country-flags/svg/bulgaria.svg'
      ]);
      expect(iconService.isSvgIconCached('en', 'languages')).toBe(true);
      expect(iconService.isSvgIconCached('bg', 'languages')).toBe(true);
    });

    it('should expose the logged in user', () => {
      flushFlags();
      const user: ApplicationUser = { id: 'user-1', username: 'Player One' } as ApplicationUser;

      flushUserCheck(user);

      expect(component.authUser()).toEqual(user);
    });

    it('should keep the default component strings for a non-Bulgarian locale', () => {
      flushFlags();
      flushUserCheck();

      expect(getCurrentResourceStrings(PaginatorResourceStringsEN).igx_paginator_label)
        .toBe(PaginatorResourceStringsEN.igx_paginator_label);
    });

    it('should show the message passed in the query string', async () => {
      flushFlags();
      flushUserCheck();

      await TestBed.inject(Router).navigateByUrl('/?message=Registration%20complete');

      expect(successes).toEqual(['Registration complete']);
    });

    it('should not show a message when none is passed in the query string', async () => {
      flushFlags();
      flushUserCheck();

      await TestBed.inject(Router).navigateByUrl('/?source=email');

      expect(successes).toEqual([]);
    });

    it('should toggle the drawer from the menu button and close it on navigation', async () => {
      flushFlags();
      flushUserCheck();
      const menu = el().querySelector<HTMLButtonElement>('button.drawer-action');

      expect(drawer().isOpen).toBe(false);
      expect(menu.getAttribute('aria-expanded')).toBe('false');
      menu.click();
      await render();
      expect(drawer().isOpen).toBe(true);
      expect(menu.getAttribute('aria-expanded')).toBe('true');

      await TestBed.inject(Router).navigateByUrl('/');
      await render();

      expect(drawer().isOpen).toBe(false);
    });

    it('should expose the menu toggle as a named button controlling the drawer', () => {
      flushFlags();
      flushUserCheck();
      const menu = el().querySelector<HTMLButtonElement>('igx-navbar-action button.drawer-action');

      expect(menu).not.toBeNull();
      expect(menu.type).toBe('button');
      expect(menu.getAttribute('aria-label')).toBe('Toggle navigation menu');
      expect(menu.getAttribute('aria-controls')).toBe('navigation');
      expect(el().querySelector('#navigation')).not.toBeNull();
      expect(el().querySelector('igx-navbar-action igx-icon[class*="navigatable"]')).toBeNull();
    });

    it('should link the logo to the home page', () => {
      flushFlags();
      flushUserCheck();
      const logo = el().querySelector<HTMLImageElement>('igx-navbar-action img');
      const link = logo.closest('a');

      expect(link).not.toBeNull();
      expect(link.getAttribute('href')).toBe('/');
      expect(logo.getAttribute('alt')).toBe('Esports Business League');
    });

    it('should render the drawer items as links', () => {
      flushFlags();
      flushUserCheck();
      const items = Array.from(el().querySelectorAll<HTMLElement>('[igxDrawerItem]:not(.igx-nav-drawer__item--header)'));

      expect(items.length).toBe(7);
      items.forEach(item => {
        expect(item.tagName).toBe('A');
        expect(item.getAttribute('href')).toBeTruthy();
      });
      expect(items.map(i => i.querySelector('span').textContent.trim())).toEqual([
        'EBL Seasons', 'Tournaments', 'Shop', 'Tournament format', 'Our partners', 'Our crew', 'Contact us'
      ]);
      expect(items.map(i => i.getAttribute('href'))).toEqual([
        '/tournaments', '/tournaments/hub', component.shopUrl, '/tournaments/format', '/#partners', '/tournaments/crew', '/#aboutus'
      ]);
    });

    describe('drawer pinning', () => {
      let innerWidth: number;

      const resizeTo = async (width: number) => {
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
        window.dispatchEvent(new Event('resize'));
        // The drawer debounces window resizes
        vi.advanceTimersByTime(200);
        await render();
      };
      const miniItemTitles = () => Array.from(el().querySelectorAll('[igxDrawerItem][title]')).map(i => i.getAttribute('title'));

      beforeEach(() => {
        innerWidth = window.innerWidth;
        flushFlags();
        flushUserCheck();
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: innerWidth });
      });

      it('should show the mini drawer while the drawer is pinned on wide screens', async () => {
        expect(component.drawerPinned()).toBe(false);
        expect(miniItemTitles()).toEqual([]);

        await resizeTo(1700);

        expect(drawer().pin).toBe(true);
        expect(component.drawerPinned()).toBe(true);
        expect(miniItemTitles()).toEqual([
          'EBL Seasons', 'Tournaments', 'Shop', 'Tournament format', 'Our partners', 'Our crew', 'Contact us'
        ]);
        Array.from(el().querySelectorAll('[igxDrawerItem][title]')).forEach(item => expect(item.tagName).toBe('A'));

        await resizeTo(1024);

        expect(drawer().pin).toBe(false);
        expect(component.drawerPinned()).toBe(false);
        expect(miniItemTitles()).toEqual([]);
      });
    });

    it('should render the copyright for the current year', () => {
      flushFlags();
      flushUserCheck();

      expect(el().querySelector('footer').textContent).toContain(`Copyright © Bellum Gens, 2019-${component.year}`);
    });
  });

  describe('with the Bulgarian locale', () => {
    afterEach(() => {
      // Restore the English strings for the components
      changei18n({
        ...ActionStripResourceStringsEN, ...BannerResourceStringsEN, ...CalendarResourceStringsEN, ...CarouselResourceStringsEN,
        ...ChipResourceStringsEN, ...ComboResourceStringsEN, ...DatePickerResourceStringsEN, ...DateRangePickerResourceStringsEN,
        ...GridResourceStringsEN, ...InputResourceStringsEN, ...ListResourceStringsEN, ...PaginatorResourceStringsEN,
        ...QueryBuilderResourceStringsEN, ...TimePickerResourceStringsEN, ...TreeResourceStringsEN
      });
    });

    it('should switch the component strings to Bulgarian', () => {
      create({ locale: 'bg' });
      flushFlags();
      flushUserCheck();

      expect(getCurrentResourceStrings(PaginatorResourceStringsEN).igx_paginator_label)
        .toBe(IgxResourceStringsBG.igx_paginator_label);
    });
  });

  describe('on the server', () => {
    beforeEach(() => create({ platform: 'server' }));

    it('should not register icons or expose a user', () => {
      flushUserCheck({ id: 'user-1' } as ApplicationUser);

      expect(flushFlags()).toEqual([]);
      expect(TestBed.inject(IgxIconService).isSvgIconCached('discord', 'login-icons')).toBe(false);
      // The login button still looks the user up, but the app shell does not use it
      expect(loginService.applicationUser()).toEqual({ id: 'user-1' });
      expect(component.authUser()).toBeNull();
    });

    it('should not show messages from the query string', async () => {
      flushUserCheck();

      await TestBed.inject(Router).navigateByUrl('/?message=Registration%20complete');

      expect(successes).toEqual([]);
    });
  });
});
