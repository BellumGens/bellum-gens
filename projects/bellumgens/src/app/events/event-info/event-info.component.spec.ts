import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoComponent } from './event-info.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;
  let apiService: ApiTournamentsService;
  let httpMock: HttpTestingController;
  let metaService: Meta;
  let titleService: Title;
  let params: BehaviorSubject<Params>;

  const tournamentUrl = (id = '123') => `${apiService['_apiEndpoint']}/tournament?id=${id}`;
  const regsUrl = (id = '123') => `${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=${id}`;
  const matchesUrl = (id = '123') => `${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=${id}`;

  const el = (): HTMLElement => fixture.nativeElement;
  // igx-avatar renders its image as the background of an inner element
  const avatarImage = (avatar: Element) => avatar.querySelector<HTMLElement>('.igx-avatar__image')?.style.backgroundImage;

  beforeEach(async () => {
    params = new BehaviorSubject<Params>({ tournamentId: '123' });

    await TestBed.configureTestingModule({
      imports: [
        EventInfoComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params, data: of({}) } },
        Title,
        Meta,
        provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiTournamentsService);
    metaService = TestBed.inject(Meta);
    titleService = TestBed.inject(Title);
    httpMock = TestBed.inject(HttpTestingController);
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const loadTournament = async (data: { tournament?: unknown; regs?: unknown[]; matches?: unknown[] } = {}, id = '123') => {
    httpMock.expectOne(tournamentUrl(id)).flush(data.tournament ?? { id, name: 'BGE Circuit', description: 'SC2 league', logo: 'logo.png' });
    httpMock.expectOne(regsUrl(id)).flush(data.regs ?? []);
    httpMock.expectOne(matchesUrl(id)).flush(data.matches ?? []);
    await fixture.whenStable();
  };

  afterEach(() => {
    httpMock.verify();
  });

  describe('with a tournament in the route', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should create', async () => {
      expect(component).toBeTruthy();
      await loadTournament();
    });

    it('should set tournament details on init', async () => {
      const mockTournament = { id: '123', name: 'Test Tournament', description: 'Test Description', logo: 'test-logo' } as any;
      const req = httpMock.expectOne(tournamentUrl());
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(false);
      req.flush(mockTournament);
      expect(component.tournament()).toEqual(mockTournament);
      expect(component.tournamentId()).toBe('123');
      expect(component.signUpDisabled()).toBe(false);
      // The meta tags are updated by an effect
      await fixture.whenStable();
      expect(titleService.getTitle()).toBe('Test Tournament');
      expect(metaService.getTag('name="og:title"').content).toBe('Test Tournament');
      expect(metaService.getTag('name="og:image"').content).toBe('test-logo');
      expect(metaService.getTag('name="og:description"').content).toBe('Test Description');
      expect(metaService.getTag('name="description"').content).toBe('Test Description');
      expect(metaService.getTag('name="twitter:title"').content).toBe('Test Tournament');
      expect(metaService.getTag('name="twitter:description"').content).toBe('Test Description');

      httpMock.expectOne(regsUrl()).flush([]);
      httpMock.expectOne(matchesUrl()).flush([]);
    });

    it('should call getSc2Registrations and getSc2Matches on init', () => {
      const mockRegistrations = [{ id: 'reg1' }] as any[];
      const mockTournament = { id: '123', name: 'Test Tournament', description: 'Test Description', logo: 'test-logo' } as any;
      let req = httpMock.expectOne(tournamentUrl());
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(false);
      req.flush(mockTournament);

      expect(component.loading()).toBe(true);
      req = httpMock.expectOne(regsUrl());
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(false);
      req.flush(mockRegistrations);
      expect(component.registrations()).toEqual(mockRegistrations);
      expect(component.loading()).toBe(false);

      const mockMatches = [{ id: 'match1' }] as any[];
      expect(component.loadingMatches()).toBe(true);
      req = httpMock.expectOne(matchesUrl());
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(false);
      req.flush(mockMatches);
      expect(component.loadingMatches()).toBe(false);
      expect(component.sc2matches()).toEqual(mockMatches);
    });

    it('should re-fetch the matches on refresh', async () => {
      await loadTournament();

      component.refreshMatches();

      const req = httpMock.expectOne(matchesUrl());
      expect(component.loadingMatches()).toBe(true);
      req.flush([{ id: 'match2' }]);
      expect(component.loadingMatches()).toBe(false);
      expect(component.sc2matches()).toEqual([{ id: 'match2' }]);
    });

    it('should re-fetch the registrations and matches when the route switches to another tournament', async () => {
      await loadTournament();

      params.next({ tournamentId: '456' });
      TestBed.tick();

      await loadTournament({ tournament: { id: '456', name: 'Second Circuit', description: 'Another', logo: 'other.png' } }, '456');
      expect(component.tournamentId()).toBe('456');
      expect(el().querySelector('[igxCardHeaderTitle]').textContent.trim()).toBe('Second Circuit');
      expect(titleService.getTitle()).toBe('Second Circuit');
    });

    it('should keep the current tournament when the route params have no tournament', async () => {
      await loadTournament();

      params.next({});
      TestBed.tick();

      expect(component.tournamentId()).toBe('123');
    });

    it('should render the tournament name, description and an enabled sign-up link', async () => {
      await loadTournament();

      expect(el().querySelector('[igxCardHeaderTitle]').textContent.trim()).toBe('BGE Circuit');
      expect(el().querySelector('igx-card-content p').textContent.trim()).toBe('SC2 league');
      const signUp = el().querySelector('igx-card-header a[igxButton]');
      expect(signUp.textContent.trim()).toBe('Sign-up to participate');
      expect(signUp.classList).not.toContain('igx-button--disabled');
    });

    it('should show a progress indicator while the registrations are loading', async () => {
      httpMock.expectOne(tournamentUrl()).flush({ id: '123', name: 'BGE Circuit' });
      await fixture.whenStable();
      expect(el().querySelector('.participants-container igx-circular-bar')).toBeTruthy();

      httpMock.expectOne(regsUrl()).flush([]);
      httpMock.expectOne(matchesUrl()).flush([]);
      await fixture.whenStable();
      expect(el().querySelector('.participants-container igx-circular-bar')).toBeNull();
    });

    it('should render the registered participants', async () => {
      await loadTournament({
        regs: [
          { id: 'r1', user: { id: 'u1', username: 'Alpha', sc2Details: { avatarUrl: 'alpha.png' } }, country: 'North Macedonia', companyId: 'ACME' },
          { id: 'r2', user: { id: 'u2', username: '' }, country: 'Serbia', battleTag: 'Beta#1234' }
        ]
      });

      const slots = el().querySelectorAll('.registration-slot');
      expect(slots.length).toBe(2);

      const first = slots[0];
      const firstLink = first.querySelector('a');
      expect(firstLink.textContent.trim()).toBe('Alpha');
      expect(firstLink.getAttribute('href')).toBe('/players/u1/sc');
      expect(first.querySelector('span').textContent).toBe('[ACME]');
      expect(avatarImage(first.querySelector('igx-avatar'))).toContain('alpha.png');
      expect(first.querySelector('.country-badge-small').getAttribute('title')).toBe('North Macedonia');
      expect(avatarImage(first.querySelector('.country-badge-small'))).toContain('assets/country-flags/svg/north-macedonia.svg');

      // Without a username the participant's battle tag is shown, and there's no company tag
      const second = slots[1];
      expect(second.querySelector('a').textContent.trim()).toBe('Beta#1234');
      expect(second.querySelector('a').getAttribute('href')).toBe('/players/u2/sc');
      expect(second.querySelector('span')).toBeNull();
    });

    it('should show the empty grid message when there are no matches', async () => {
      await loadTournament();

      const grid = el().querySelector('igx-grid');
      expect(grid.querySelector('igx-grid-toolbar-title').textContent.trim()).toBe('Match Results');
      expect(grid.textContent).toContain('No matches found...');
      expect(grid.querySelectorAll('igx-grid-row').length).toBe(0);
    });

    it('should render a match won by the first player with races, video and replay', async () => {
      await loadTournament({
        matches: [{
          id: 'm1',
          startTime: '2026-10-01T18:30:00',
          player1: { username: 'Alpha', avatarUrl: 'alpha.png' },
          player2: { username: 'Beta', avatarUrl: 'beta.png' },
          player1Points: 2,
          player2Points: 1,
          player1Race: 1,
          player2Race: 2,
          videoLink: 'https://youtube.com/watch?v=1',
          demoLink: 'https://replays.example/1'
        }]
      });

      const grid = el().querySelector('igx-grid');
      expect(grid.querySelectorAll('igx-grid-groupby-row').length).toBe(1);
      const cells = grid.querySelector('igx-grid-row').querySelectorAll('igx-grid-cell');
      expect(cells[0].textContent.trim()).toBe('Oct 1, 2026, 6:30 PM');

      const players = cells[1].querySelectorAll('.grid-team-name');
      expect(players[0].className).toContain('highlight');
      expect(players[0].className).toContain('color-success');
      expect(players[0].textContent).toContain('Alpha');
      expect(players[0].querySelector('igx-icon[title="Winner"]')).toBeTruthy();
      expect(avatarImage(players[0].querySelector('.avatar-no-background'))).toContain('assets/bge/race/protoss.png');

      expect(players[1].className).not.toContain('highlight');
      expect(players[1].textContent).toContain('Beta');
      expect(players[1].querySelector('igx-icon[title="Winner"]')).toBeNull();
      expect(avatarImage(players[1].querySelector('.avatar-no-background'))).toContain('assets/bge/race/terran.png');

      const video = cells[2].querySelector('a');
      expect(video.getAttribute('href')).toBe('https://youtube.com/watch?v=1');
      expect(video.textContent).toContain('Video');
      const replay = cells[3].querySelector('a');
      expect(replay.getAttribute('href')).toBe('https://replays.example/1');
      expect(replay.textContent).toContain('Replay');
    });

    it('should render a match won by the second player without races or links', async () => {
      await loadTournament({
        matches: [{
          id: 'm2',
          startTime: '2026-10-08T18:00:00',
          player1: { username: 'Alpha' },
          player2: { username: 'Beta' },
          player1Points: 0,
          player2Points: 2
        }]
      });

      const cells = el().querySelector('igx-grid igx-grid-row').querySelectorAll('igx-grid-cell');
      const players = cells[1].querySelectorAll('.grid-team-name');
      expect(players[0].className).not.toContain('highlight');
      expect(players[0].querySelector('igx-icon[title="Winner"]')).toBeNull();
      expect(players[0].querySelector('.avatar-no-background')).toBeNull();
      expect(players[1].className).toContain('highlight');
      expect(players[1].querySelector('igx-icon[title="Winner"]')).toBeTruthy();
      expect(players[1].querySelector('.avatar-no-background')).toBeNull();

      expect(cells[2].querySelector('a')).toBeNull();
      expect(cells[3].querySelector('a')).toBeNull();
    });
  });

  describe('with a closed tournament in the route', () => {
    const closedId = '1fe0af1f-7dfc-4476-db4d-08dd4cd5c5da';

    beforeEach(() => {
      params.next({ tournamentId: closedId });
      createComponent();
    });

    it('should disable the sign-up link', async () => {
      await loadTournament({ tournament: { id: closedId, name: 'Closed Circuit' } }, closedId);

      expect(component.signUpDisabled()).toBe(true);
      const signUp = el().querySelector('igx-card-header a[igxButton]');
      expect(signUp.classList).toContain('igx-button--disabled');
    });
  });

  describe('without a tournament in the route', () => {
    beforeEach(() => {
      params.next({});
      createComponent();
    });

    it('should not load any tournament data', async () => {
      await fixture.whenStable();

      expect(component.tournamentId()).toBeUndefined();
      expect(component.tournament()).toBeNull();
      expect(component.registrations()).toBeUndefined();
      expect(component.sc2matches()).toBeUndefined();
      expect(component.signUpDisabled()).toBe(false);
      expect(el().querySelector('[igxCardHeaderTitle]').textContent.trim()).toBe('');
      expect(el().querySelectorAll('.registration-slot').length).toBe(0);
      // Without a tournament the page keeps the default title from the route data
      expect(titleService.getTitle()).toBe('Bellum Gens: Premier Gaming and Esports Events Organizer');
      httpMock.expectNone(() => true);
    });
  });
});
