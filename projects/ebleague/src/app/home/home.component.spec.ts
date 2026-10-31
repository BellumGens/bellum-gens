import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { ApiTournamentsService, Game, LoginService, RegistrationsCount } from '../../../../common/src/public_api';

describe('TournamentHomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;

  const el = (): HTMLElement => fixture.nativeElement;
  const activeTournamentUrl = () => `${apiService['_apiEndpoint']}/tournament/activetournament`;
  const regCountUrl = (id: string) => `${apiService['_apiEndpoint']}/tournament/regcount?tournamentId=${id}`;
  const render = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        HomeComponent
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userEmail to an empty string', () => {
    expect(component.userEmail()).toBe('');
  });

  it('should have gameEnum property', () => {
    expect(component.gameEnum).toBeDefined();
  });

  it('should have registrations property', () => {
    expect(component.registrations()).toBeDefined();
  });

  it('should have authUser property', () => {
    expect(component.authUser()).toBeDefined();
  });

  it('should have openLogin method', () => {
    expect(component.openLogin).toBeDefined();
    expect(typeof component.openLogin).toBe('function');
  });

  it('should link the league format headings to the format page', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('.format-card-header h3 a') as NodeListOf<HTMLAnchorElement>);

    expect(links.map(l => l.textContent.trim())).toEqual(['Counter-Strike League', 'StarCraft II League']);
    links.forEach(l => expect(l.getAttribute('href')).toBe('/format'));
  });

  it('should clear the subscription email from a named button', async () => {
    const clear = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('form igx-suffix button');
    expect(clear()).toBeNull();

    component.userEmail.set('fan@example.com');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(clear().type).toBe('button');
    expect(clear().getAttribute('aria-label')).toBe('Clear email');

    clear().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.userEmail()).toBe('');
    expect(clear()).toBeNull();
  });

  describe('the active tournament', () => {
    it('loads the registration counts of the active tournament', async () => {
      const counts: RegistrationsCount [] = [{ game: Game.CSGO, count: 12 }, { game: Game.StarCraft2, count: 7 }];

      httpMock.expectOne(activeTournamentUrl()).flush({ id: 't1', name: 'Season 3' });
      await render();
      httpMock.expectOne(regCountUrl('t1')).flush(counts);

      expect(component.tournamentId()).toBe('t1');
      expect(component.registrations()).toEqual(counts);
    });

    it('does not ask for registration counts while there is no active tournament', async () => {
      httpMock.expectOne(activeTournamentUrl()).flush(null);
      await render();

      expect(component.tournamentId()).toBeNull();
      httpMock.expectNone(req => req.url.includes('/tournament/regcount'));
    });
  });

  describe('page actions', () => {
    it('scrolls to the league description from the learn more button', () => {
      const scroll = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => undefined);

      el().querySelector<HTMLButtonElement>('.info-button').click();

      expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth' });
      expect(scroll.mock.contexts[0]).toBe(el().querySelector('#moreinfo'));
      scroll.mockRestore();
    });

    it('does nothing when asked to scroll to a section that is not on the page', () => {
      const scroll = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => undefined);

      component.scrollTo('missing-section');

      expect(scroll).not.toHaveBeenCalled();
      scroll.mockRestore();
    });

    it('asks the app to open the login dialog', () => {
      let opened = 0;
      TestBed.inject(LoginService).openLogin.subscribe(() => opened++);

      component.openLogin();

      expect(opened).toBe(1);
    });

    it('opens a prepared tweet from the tweet button', () => {
      const open = vi.spyOn(window, 'open').mockReturnValue(null);

      el().querySelector<HTMLButtonElement>('button.space-out-button').click();

      expect(open).toHaveBeenCalledTimes(1);
      expect(open.mock.calls[0][0]).toContain('Hey @EsportBLeague');
      open.mockRestore();
    });
  });

  describe('email updates', () => {
    const subscribeRequests = () => httpMock.match(req => req.method === 'POST' && req.url.endsWith('/subscribe'));

    it('subscribes the email typed into the form', async () => {
      const input = el().querySelector<HTMLInputElement>('#subemail');
      input.value = 'fan@example.com';
      input.dispatchEvent(new Event('input'));
      await render();
      expect(component.userEmail()).toBe('fan@example.com');
      const submit = el().querySelector<HTMLButtonElement>('button.submit-email');
      expect(submit.disabled).toBe(false);

      submit.click();

      const requests = subscribeRequests();
      expect(requests.length).toBe(1);
      expect(requests[0].request.body).toEqual({ email: 'fan@example.com' });
      requests[0].flush({});
    });

    it('does not subscribe without an email', () => {
      component.subscribe();

      expect(subscribeRequests().length).toBe(0);
    });
  });
});

describe('TournamentHomeComponent on the server', () => {
  it('neither loads the active tournament nor looks up the user', async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), HomeComponent],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();
    const httpMock = TestBed.inject(HttpTestingController);

    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.tournament()).toBeNull();
    expect(fixture.componentInstance.authUser()).toBeNull();
    httpMock.expectNone(req => req.url.includes('/tournament/activetournament'));
  });
});
