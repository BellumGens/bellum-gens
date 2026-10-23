import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueRegistrationComponent } from './league-registration.component';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import {
  ApiTournamentsService,
  ApplicationUser,
  CommunicationService,
  Game,
  LoginService,
  Tournament,
  TournamentApplication
} from '../../../../../common/src/public_api';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SwPush } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';

const USER = {
  id: 'u1',
  username: 'Alpha',
  email: 'alpha@example.com',
  sc2Details: { battleNetBattleTag: 'Alpha#1234' },
  steamUser: { country: 'Bulgaria' }
} as unknown as ApplicationUser;

const ACTIVE_TOURNAMENT = { id: 'active-1', name: 'BGE Balkan Circuit', description: 'The active league', logo: 'active.png' } as Tournament;

describe('LeagueRegistrationComponent', () => {
  let component: LeagueRegistrationComponent;
  let fixture: ComponentFixture<LeagueRegistrationComponent>;
  let loginService: LoginService;
  let apiTournamentsService: ApiTournamentsService;
  let communicationService: CommunicationService;
  let httpMock: HttpTestingController;
  let params: BehaviorSubject<Params>;

  const api = () => apiTournamentsService['_apiEndpoint'];
  const userUrl = () => loginService['_apiEndpoint'];
  const activeTournamentUrl = () => `${api()}/tournament/activetournament`;
  const tournamentUrl = (id: string) => `${api()}/tournament?id=${id}`;
  const companiesUrl = () => `${api()}/companies`;
  const userRegistrationUrl = (id: string) => `${api()}/tournament/userregistration?tournamentId=${id}`;
  const registerUrl = (id = '') => `${api()}/tournament/registerbge?tournamentId=${id}`;

  const el = (): HTMLElement => fixture.nativeElement;
  const input = (name: string) => el().querySelector<HTMLInputElement>(`input[name="${name}"]`);
  const suffix = (name: string) => input(name).closest('igx-input-group').querySelector<HTMLButtonElement>('igx-suffix button');
  const submitButton = () => el().querySelector<HTMLButtonElement>('button.submit-registration');
  const details = () => el().querySelector<HTMLElement>('.application-details');
  const termsDialog = (): IgxDialogComponent => fixture.debugElement.query(By.directive(IgxDialogComponent)).componentInstance;
  const termsCheckbox = (): IgxCheckboxComponent => fixture.debugElement.query(By.directive(IgxCheckboxComponent)).componentInstance;
  const dialogButton = (text: string): HTMLButtonElement =>
    Array.from(document.querySelectorAll<HTMLButtonElement>('.igx-dialog__window-actions button')).find(b => b.textContent.includes(text));

  const type = async (name: string, value: string) => {
    const field = input(name);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const acceptTerms = async () => {
    el().querySelector<HTMLInputElement>('igx-checkbox input[type="checkbox"]').click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    params = new BehaviorSubject<Params>({});

    await TestBed.configureTestingModule({
      imports: [
        LeagueRegistrationComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params } },
        { provide: SwPush, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    loginService = TestBed.inject(LoginService);
    communicationService = TestBed.inject(CommunicationService);
    apiTournamentsService = TestBed.inject(ApiTournamentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Creates the component, optionally for a logged in user and a tournament given in the route. */
  const create = async (options: { user?: ApplicationUser; tournamentId?: string } = {}) => {
    if (options.tournamentId) {
      params.next({ tournamentId: options.tournamentId });
    }
    if (options.user) {
      loginService['_applicationUser'].set(options.user);
    }
    fixture = TestBed.createComponent(LeagueRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  describe('without a logged in user', () => {
    beforeEach(async () => {
      await create();
      httpMock.expectOne(userUrl()).flush(null);
      httpMock.expectOne(activeTournamentUrl()).flush(ACTIVE_TOURNAMENT);
      httpMock.expectOne(companiesUrl()).flush([]);
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should register for the active tournament when the route has no tournament', () => {
      expect(component.tournament()).toEqual(ACTIVE_TOURNAMENT);
      expect(component.tournamentId()).toBe('active-1');
      expect(component.application()).toEqual({ game: Game.StarCraft2, email: '', tournamentId: 'active-1' });
    });

    it('should render the tournament details', () => {
      expect(el().querySelector('img').getAttribute('src')).toBe('active.png');
      expect(el().querySelector('#registration').textContent.trim()).toBe('BGE Balkan Circuit');
      expect(el().querySelector('p.horizontal-center').textContent.trim()).toBe('The active league');
    });

    it('should ask the user to log in and hide the registration form', () => {
      expect(el().textContent).toContain('You need to be logged in to register for the tournament.');
      expect(details().style.display).toBe('none');
      expect(submitButton().disabled).toBe(true);
    });

    it('should offer the Balkan countries regardless of the active tournament name', () => {
      expect(component.countriesList()).toBe(component.balkanCountries);
    });

    it('should fetch the registration of the active tournament once the user logs in', async () => {
      loginService['_applicationUser'].set(USER);
      await fixture.whenStable();

      httpMock.expectOne(userRegistrationUrl('active-1')).flush(null);
      await fixture.whenStable();

      expect(el().textContent).not.toContain('You need to be logged in to register for the tournament.');
      expect(details().style.display).toBe('');
      expect(component.application()).toEqual({
        game: Game.StarCraft2,
        email: 'alpha@example.com',
        tournamentId: 'active-1',
        battleNetId: 'Alpha#1234',
        country: 'Bulgaria'
      });
    });
  });

  describe('with a tournament in the route', () => {
    const loadTournament = async (name: string) => {
      await create({ tournamentId: 't1' });
      httpMock.expectOne(userUrl()).flush(null);
      httpMock.expectOne(tournamentUrl('t1')).flush({ id: 't1', name });
      httpMock.expectOne(companiesUrl()).flush([]);
      await fixture.whenStable();
    };

    it('should register for the tournament from the route', async () => {
      await loadTournament('BGE Balkan Circuit');

      httpMock.expectNone(activeTournamentUrl());
      expect(component.tournamentId()).toBe('t1');
      expect(component.application().tournamentId).toBe('t1');
      expect(el().querySelector('#registration').textContent.trim()).toBe('BGE Balkan Circuit');
    });

    it('should offer the European countries for a Europe tournament', async () => {
      await loadTournament('BGE Europe Qualifier');
      expect(component.countriesList()).toBe(component.europeCountries);
      expect(el().querySelectorAll('igx-select-item').length).toBe(component.europeCountries.length);
    });

    it('should offer the Asian countries for an Asia tournament', async () => {
      await loadTournament('BGE Asia Qualifier');
      expect(component.countriesList()).toBe(component.asiaCountries);
    });

    it('should offer the American countries for an Americas tournament', async () => {
      await loadTournament('BGE Americas Qualifier');
      expect(component.countriesList()).toBe(component.americasCountries);
    });

    it('should offer the countries of all regions sorted by name for a Wildcard tournament', async () => {
      await loadTournament('BGE Wildcard Qualifier');

      const countries = component.countriesList();
      const regions = [component.europeCountries, component.asiaCountries, component.americasCountries, component.oceaniaCountries];
      expect(countries.length).toBe(regions.reduce((total, region) => total + region.length, 0));
      const names = countries.map(c => c.name);
      expect(names).toEqual([...names].sort());
      expect(countries).toContainEqual({ name: 'New Zealand', value: 'New Zealand' });
      expect(countries).toContainEqual({ name: 'United States', value: 'United States of America' });
    });

    it('should offer the Balkan countries for any other tournament', async () => {
      await loadTournament('BGE Stara Zagora');
      expect(component.countriesList()).toBe(component.balkanCountries);
    });
  });

  describe('with an already logged in user and no tournament in the route', () => {
    it('should fetch the registration only once the active tournament is known', async () => {
      await create({ user: USER });

      // The active tournament is still loading, so its registration can't be requested yet
      httpMock.expectNone(req => req.url.includes('/tournament/userregistration'));
      expect(component.tournamentId()).toBeUndefined();

      httpMock.expectOne(activeTournamentUrl()).flush(ACTIVE_TOURNAMENT);
      httpMock.expectOne(companiesUrl()).flush([]);
      await fixture.whenStable();

      const req = httpMock.expectOne(userRegistrationUrl('active-1'));
      expect(req.request.withCredentials).toBe(true);
      req.flush(null);
      await fixture.whenStable();

      expect(component.application()).toEqual({
        game: Game.StarCraft2,
        email: 'alpha@example.com',
        tournamentId: 'active-1',
        battleNetId: 'Alpha#1234',
        country: 'Bulgaria'
      });
    });
  });

  describe('with a logged in user', () => {
    const loadForUser = async (registration: TournamentApplication | null, companies: string[] = []) => {
      await create({ user: USER, tournamentId: 't1' });
      httpMock.expectOne(tournamentUrl('t1')).flush({ id: 't1', name: 'BGE Balkan Circuit' });
      httpMock.expectOne(companiesUrl()).flush(companies);
      const req = httpMock.expectOne(userRegistrationUrl('t1'));
      expect(req.request.withCredentials).toBe(true);
      req.flush(registration);
      await fixture.whenStable();
    };

    describe('who has not registered yet', () => {
      beforeEach(async () => {
        await loadForUser(null);
      });

      it('should prefill the application with the user details', () => {
        expect(details().style.display).toBe('');
        expect(component.application()).toEqual({
          game: Game.StarCraft2,
          email: 'alpha@example.com',
          tournamentId: 't1',
          battleNetId: 'Alpha#1234',
          country: 'Bulgaria'
        });
        expect(input('email').value).toBe('alpha@example.com');
        expect(input('battletag').value).toBe('Alpha#1234');
        expect(submitButton().textContent.trim()).toBe('Register');
      });

      it('should update the application as the user fills in the form', async () => {
        await type('firstName', 'Konstantin');
        await type('lastName', 'Dinev');
        await type('discord', 'alpha#0001');
        await type('email', 'new@example.com');
        await type('battletag', 'Beta#5678');
        await type('company', 'ACME');

        expect(component.application()).toEqual(expect.objectContaining({
          firstName: 'Konstantin',
          lastName: 'Dinev',
          discord: 'alpha#0001',
          email: 'new@example.com',
          battleNetId: 'Beta#5678',
          companyId: 'ACME'
        }));
      });

      it('should update the country when one is selected', async () => {
        const serbia = Array.from(el().querySelectorAll<HTMLElement>('igx-select-item')).find(i => i.textContent.includes('Serbia'));
        serbia.click();
        await fixture.whenStable();

        expect(component.application().country).toBe('Serbia');
      });

      it('should render the clear actions as named buttons that do not submit the form', async () => {
        const fields = ['email', 'firstName', 'lastName', 'discord', 'battletag', 'company'];
        for (const field of fields) {
          await type(field, 'Value');
        }

        expect(fields.map(field => suffix(field).type)).toEqual(fields.map(() => 'button'));
        expect(fields.map(field => suffix(field).getAttribute('aria-label'))).toEqual([
          'Clear email', 'Clear first name', 'Clear last name', 'Clear Discord ID', 'Clear battle tag', 'Clear team'
        ]);
      });

      it('should open the terms from a keyboard focusable link without navigating', async () => {
        const link = el().querySelector<HTMLAnchorElement>('label a');
        expect(link.getAttribute('href')).toBe('#');

        const click = new MouseEvent('click', { bubbles: true, cancelable: true });
        link.dispatchEvent(click);
        await fixture.whenStable();

        expect(click.defaultPrevented).toBe(true);
        expect(termsDialog().isOpen).toBe(true);
        expect(termsCheckbox().checked).toBe(false);
      });

      it('should label the battle tag field', () => {
        expect(el().querySelector('label[for="battletag"]').textContent.trim()).toBe('Battle tag');
      });

      it('should clear a field when its clear icon is clicked', async () => {
        const fields = ['email', 'firstName', 'lastName', 'discord', 'battletag', 'company'];
        for (const field of fields) {
          await type(field, 'Value');
        }

        for (const field of fields) {
          suffix(field).click();
          await fixture.whenStable();
        }

        expect(component.application()).toEqual(expect.objectContaining({
          email: null,
          firstName: null,
          lastName: null,
          discord: null,
          battleNetId: null,
          companyId: null
        }));
        for (const field of fields) {
          expect(input(field).value).toBe('');
          expect(suffix(field)).toBeNull();
        }
      });

      it('should keep the submit button disabled until the form is valid and the terms are accepted', async () => {
        // The discord ID is required
        expect(submitButton().disabled).toBe(true);
        await type('discord', 'alpha#0001');
        expect(submitButton().disabled).toBe(true);

        await acceptTerms();
        expect(termsCheckbox().checked).toBe(true);
        expect(submitButton().disabled).toBe(false);

        await type('email', 'not-an-email');
        expect(submitButton().disabled).toBe(true);
        await type('email', 'alpha@example.com');
        expect(submitButton().disabled).toBe(false);

        await type('battletag', 'Alpha');
        expect(submitButton().disabled).toBe(true);
      });

      it('should accept the terms from the terms and conditions dialog', async () => {
        el().querySelector<HTMLAnchorElement>('label a').click();
        await fixture.whenStable();
        expect(termsDialog().isOpen).toBe(true);
        expect(termsCheckbox().checked).toBe(false);

        dialogButton('OK').click();
        await fixture.whenStable();

        expect(termsDialog().isOpen).toBe(false);
        expect(termsCheckbox().checked).toBe(true);
      });

      it('should not accept the terms when the terms and conditions dialog is cancelled', async () => {
        el().querySelector<HTMLAnchorElement>('label a').click();
        await fixture.whenStable();
        expect(termsDialog().isOpen).toBe(true);

        dialogButton('Cancel').click();
        await fixture.whenStable();

        expect(termsDialog().isOpen).toBe(false);
        expect(termsCheckbox().checked).toBe(false);
      });

      it('should submit a new registration', async () => {
        const success = vi.spyOn(communicationService, 'emitSuccess');
        await type('discord', 'alpha#0001');
        await acceptTerms();

        submitButton().click();
        await fixture.whenStable();

        expect(component.inProgress()).toBe(true);
        expect(submitButton().disabled).toBe(true);
        const req = httpMock.expectOne(registerUrl());
        expect(req.request.method).toBe('PUT');
        expect(req.request.withCredentials).toBe(true);
        expect(req.request.body).toEqual({
          game: Game.StarCraft2,
          email: 'alpha@example.com',
          tournamentId: 't1',
          battleNetId: 'Alpha#1234',
          country: 'Bulgaria',
          discord: 'alpha#0001'
        });
        req.flush({ ...req.request.body, id: 'reg-1' });
        await fixture.whenStable();

        expect(success).toHaveBeenCalledWith('Registration successful!');
        expect(component.application().id).toBe('reg-1');
        expect(component.inProgress()).toBe(false);
        expect(submitButton().textContent.trim()).toBe('Update Registration');
      });

      it('should report a failed registration', async () => {
        const error = vi.spyOn(communicationService, 'emitError');
        await type('discord', 'alpha#0001');
        await acceptTerms();

        submitButton().click();
        await fixture.whenStable();

        httpMock.expectOne(registerUrl()).flush('Server error', { status: 500, statusText: 'Server Error' });
        await fixture.whenStable();

        // The error is reported once, by the service
        expect(error).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(expect.stringContaining('500 Server Error'));
        expect(component.inProgress()).toBe(false);
        expect(component.application().id).toBeUndefined();
        expect(submitButton().disabled).toBe(false);
        expect(submitButton().textContent.trim()).toBe('Register');
      });
    });

    describe('who has already registered', () => {
      const registration: TournamentApplication = {
        id: 'reg-1',
        game: Game.StarCraft2,
        email: 'registered@example.com',
        tournamentId: 't1',
        firstName: 'Konstantin',
        lastName: 'Dinev',
        discord: 'alpha#0001',
        battleNetId: 'Alpha#1234',
        country: 'Serbia'
      };

      beforeEach(async () => {
        await loadForUser(registration);
      });

      it('should load the existing registration', () => {
        expect(component.application()).toEqual(registration);
        expect(input('email').value).toBe('registered@example.com');
        expect(input('firstName').value).toBe('Konstantin');
        expect(input('lastName').value).toBe('Dinev');
        expect(input('discord').value).toBe('alpha#0001');
        expect(submitButton().textContent.trim()).toBe('Update Registration');
      });

      it('should update the existing registration', async () => {
        const success = vi.spyOn(communicationService, 'emitSuccess');
        await type('firstName', 'Kosta');
        await acceptTerms();
        expect(submitButton().disabled).toBe(false);

        submitButton().click();
        await fixture.whenStable();

        const req = httpMock.expectOne(registerUrl('reg-1'));
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ ...registration, firstName: 'Kosta' });
        req.flush({ ...registration, firstName: 'Kosta', state: 1 });
        await fixture.whenStable();

        expect(success).toHaveBeenCalledWith('Registration updated successfully!');
        // The local application is kept as it was submitted
        expect(component.application()).toEqual({ ...registration, firstName: 'Kosta' });
        expect(component.inProgress()).toBe(false);
      });
    });

    describe('with registered teams', () => {
      beforeEach(async () => {
        await loadForUser(null, ['ACME', 'Apex', 'Bellum']);
      });

      it('should suggest the teams starting with the typed text', async () => {
        await type('company', 'a');

        const suggestions = Array.from(document.querySelectorAll('igx-drop-down-item')).map(i => i.textContent.trim());
        expect(suggestions).toEqual(['ACME', 'Apex']);
      });

      it('should clear the team and suggest all teams again when its clear icon is clicked', async () => {
        await type('company', 'a');

        suffix('company').click();
        await fixture.whenStable();

        expect(component.application().companyId).toBeNull();
        expect(input('company').value).toBe('');
        expect(suffix('company')).toBeNull();
        const suggestions = Array.from(document.querySelectorAll('igx-drop-down-item')).map(i => i.textContent.trim());
        expect(suggestions).toEqual(['ACME', 'Apex', 'Bellum']);
      });
    });
  });
});
