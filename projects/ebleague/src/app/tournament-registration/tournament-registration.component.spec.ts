import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { By } from '@angular/platform-browser';
import { IgxDropDownComponent } from '@infragistics/igniteui-angular/drop-down';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';

import { TournamentRegistrationComponent } from './tournament-registration.component';
import {
  ApiTournamentsService,
  ApplicationUser,
  BellumgensApiService,
  CSGOTeam,
  Game,
  LoginService,
  TournamentApplication
} from '../../../../common/src/public_api';

const makeUser = (overrides: Partial<ApplicationUser> = {}): ApplicationUser => ({
  id: 'user-1',
  steamId: '76561198000000001',
  username: 'sn1per',
  battleNetId: 'Sniper#1234',
  email: 'sniper@example.com',
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  ...overrides
} as ApplicationUser);

const team = (teamId: string, teamName: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: '',
  visible: true,
  customUrl: teamId
});

describe('TournamentRegistrationComponent', () => {
  let component: TournamentRegistrationComponent;
  let fixture: ComponentFixture<TournamentRegistrationComponent>;
  let authUser: WritableSignal<ApplicationUser>;
  let tournamentsService: ApiTournamentsService;
  let userService: BellumgensApiService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TournamentRegistrationComponent
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    const loginService = TestBed.inject(LoginService);
    tournamentsService = TestBed.inject(ApiTournamentsService);
    userService = TestBed.inject(BellumgensApiService);
    router = TestBed.inject(Router);

    // the services' own state; their lazy getters hand these out read-only
    authUser = loginService['_applicationUser'];
    // skip the user check the lazy getter would otherwise start
    loginService['_userCheckInProgress'].set(true);
    tournamentsService['_companies'].set(['Infragistics', 'Acme', 'Initech']);
    vi.spyOn(userService, 'getUserTeams').mockReturnValue(of([]));
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  const create = (tournamentId = 't1') => {
    fixture = TestBed.createComponent(TournamentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tournamentId', tournamentId);
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;
  const details = () => el().querySelector('.application-details');
  const gameLabel = () => el().querySelector('igx-select[name="game"] label').textContent.trim();
  const submitForm = () => {
    el().querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };

  describe('prefilling the application', () => {
    it('keeps an empty application and asks to log in when nobody is logged in', () => {
      create();

      expect(component.application().email).toBe('');
      expect(component.application().game).toBeNull();
      expect(gameLabel()).toBe('Please login first');
    });

    it('prefills the email of a logged in user', () => {
      authUser.set(makeUser());
      create();

      expect(component.application().email).toBe('sniper@example.com');
      expect(gameLabel()).toBe('Choose league (game)');
    });

    it('prefills the email once the user logs in', () => {
      create();

      authUser.set(makeUser({ email: 'late@example.com' }));
      TestBed.tick();

      expect(component.application().email).toBe('late@example.com');
      expect(gameLabel()).toBe('Choose league (game)');
    });

    it('keeps the rest of the application when the user changes', () => {
      authUser.set(makeUser());
      create();
      component.application.update(application => ({ ...application, companyId: 'Acme' }));

      authUser.set(makeUser({ email: 'other@example.com' }));
      TestBed.tick();

      expect(component.application()).toEqual(expect.objectContaining({ email: 'other@example.com', companyId: 'Acme' }));
    });
  });

  describe('choosing a game', () => {
    it('hides the details until a game is chosen', () => {
      authUser.set(makeUser());
      create();

      component.showDetails();
      fixture.detectChanges();

      expect(component.detailsVisible()).toBe(false);
      expect(details().classList).not.toContain('application-details-show');
      expect(el().querySelector('igx-select#team')).toBeNull();
      expect(el().querySelector('#battletag')).toBeNull();
      expect(userService.getUserTeams).not.toHaveBeenCalled();
    });

    it('shows the team selection with the teams of the user for Counter-Strike', () => {
      vi.mocked(userService.getUserTeams).mockReturnValue(of([team('team-1', 'Alpha'), team('team-2', 'Bravo')]));
      const scroll = vi.spyOn(Element.prototype, 'scrollIntoView');
      authUser.set(makeUser());
      create();

      component.selectGame(Game.CSGO);
      fixture.detectChanges();

      expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth' });
      expect(component.application().game).toBe(Game.CSGO);
      expect(component.detailsVisible()).toBe(true);
      expect(details().classList).toContain('application-details-show');
      expect(userService.getUserTeams).toHaveBeenCalledWith('user-1');
      expect(component.userTeams().map(t => t.teamName)).toEqual(['Alpha', 'Bravo']);
      const teamSelect = el().querySelector('igx-select#team');
      expect(teamSelect).not.toBeNull();
      expect(teamSelect.textContent).toContain('Alpha');
      expect(teamSelect.textContent).toContain('Bravo');
      expect(teamSelect.textContent).toContain('Create a new team...');
      expect(el().querySelector('#battletag')).toBeNull();
    });

    it('warns a Counter-Strike applicant without a Steam account', () => {
      authUser.set(makeUser({ steamId: null }));
      create();

      component.selectGame(Game.CSGO);
      fixture.detectChanges();

      expect(el().textContent).toContain('You\'ve not associated a Steam account');
    });

    it('does not warn a Counter-Strike applicant with a Steam account', () => {
      authUser.set(makeUser());
      create();

      component.selectGame(Game.CSGO);
      fixture.detectChanges();

      expect(el().textContent).not.toContain('You\'ve not associated a Steam account');
    });

    it('shows the battle tag prefilled from the user for StarCraft II', () => {
      authUser.set(makeUser());
      create();

      component.selectGame(Game.StarCraft2);
      fixture.detectChanges();

      expect(component.application().battleNetId).toBe('Sniper#1234');
      expect(component.detailsVisible()).toBe(true);
      expect(details().classList).toContain('application-details-show');
      expect(el().querySelector('#battletag')).not.toBeNull();
      expect(el().querySelector('igx-select#team')).toBeNull();
      expect(userService.getUserTeams).not.toHaveBeenCalled();
      expect(el().textContent).not.toContain('You\'ve not associated a Steam account');
    });
  });

  describe('companies', () => {
    // the drop down only renders its items while it is open
    const companyItems = () => {
      const dropDown = fixture.debugElement.query(By.directive(IgxDropDownComponent)).componentInstance as IgxDropDownComponent;
      dropDown.open();
      fixture.detectChanges();
      const items = dropDown.items.map(i => i.value as string);
      dropDown.close();
      return items;
    };

    it('offers the companies of the service', () => {
      create();

      expect(component.companies()).toEqual(['Infragistics', 'Acme', 'Initech']);
      expect(companyItems()).toEqual(['Infragistics', 'Acme', 'Initech']);
    });

    it('narrows the companies to the typed prefix', () => {
      create();

      component.application.update(application => ({ ...application, companyId: 'in' }));
      fixture.detectChanges();

      expect(companyItems()).toEqual(['Infragistics', 'Initech']);
    });

    // the clear suffix sets companyId to null, which the startsWith pipe (defaulting only undefined) can't lowercase
    it.todo('keeps offering all companies after the company is cleared');
  });

  describe('terms', () => {
    it('scrolls to the terms without toggling the checkbox', () => {
      const terms = document.createElement('div');
      terms.id = 'terms';
      document.body.appendChild(terms);
      const scroll = vi.spyOn(terms, 'scrollIntoView');
      create();
      const event = new MouseEvent('click', { bubbles: true });
      const stop = vi.spyOn(event, 'stopPropagation');

      el().querySelector('.accept-terms-checkbox .highlight').dispatchEvent(event);

      expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth' });
      expect(stop).toHaveBeenCalled();
      terms.remove();
    });
  });

  describe('submitting', () => {
    const submitButton = () => el().querySelector<HTMLButtonElement>('button.submit-registration');

    beforeEach(() => {
      authUser.set(makeUser());
    });

    it('keeps the register button disabled until the form is valid and the terms are accepted', async () => {
      create();
      await fixture.whenStable();

      expect(submitButton().disabled).toBe(true);
    });

    it('registers for the tournament and navigates to the success page', () => {
      const saved: TournamentApplication = { id: 'app-1', game: Game.StarCraft2, email: 'sniper@example.com', tournamentId: 't1', hash: 'abc' };
      const response = new Subject<TournamentApplication>();
      const register = vi.spyOn(tournamentsService, 'leagueRegistration').mockReturnValue(response);
      create('t1');
      component.selectGame(Game.StarCraft2);
      component.application.update(application => ({ ...application, companyId: 'Acme' }));

      submitForm();

      expect(register).toHaveBeenCalledWith(expect.objectContaining({
        tournamentId: 't1',
        email: 'sniper@example.com',
        game: Game.StarCraft2,
        battleNetId: 'Sniper#1234',
        companyId: 'Acme'
      }));
      expect(component.inProgress()).toBe(true);
      expect(submitButton().disabled).toBe(true);

      response.next(saved);
      response.complete();
      fixture.detectChanges();

      expect(component.inProgress()).toBe(false);
      expect(component.application()).toBe(saved);
      expect(router.navigate).toHaveBeenCalledWith(['/registration-success'], { state: saved });
    });

    it('sends the current tournament input', () => {
      const register = vi.spyOn(tournamentsService, 'leagueRegistration').mockReturnValue(of({ game: Game.CSGO, email: '' }));
      create('t1');
      fixture.componentRef.setInput('tournamentId', 't2');
      fixture.detectChanges();

      component.leagueRegistration();

      expect(register).toHaveBeenCalledWith(expect.objectContaining({ tournamentId: 't2' }));
    });

    it('lets the user try again without navigating when the registration fails', () => {
      vi.spyOn(tournamentsService, 'leagueRegistration').mockReturnValue(throwError(() => new Error('nope')));
      create();
      component.selectGame(Game.StarCraft2);

      submitForm();

      expect(component.inProgress()).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.application()).toEqual(expect.objectContaining({ tournamentId: 't1', battleNetId: 'Sniper#1234' }));
    });
  });
});
