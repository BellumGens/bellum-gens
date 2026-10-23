import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BgeBalkanComponent } from './bge-balkan.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BgeBalkanComponent', () => {
  let component: BgeBalkanComponent;
  let fixture: ComponentFixture<BgeBalkanComponent>;
  let apiService: ApiTournamentsService;
  //let loginService: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BgeBalkanComponent,
        
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    apiService = TestBed.inject(ApiTournamentsService);
    //loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgeBalkanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', async () => {
    const mockTournament = { id: '123' } as any;
    const mockRegistrations = [{ id: 'reg1' }] as any[];
    const mockMatches = [{ id: 'match1' }] as any[];
    const mockGroups = [{ id: 'group1' }] as any[];

    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockTournament);
    expect(component.tournament()).toEqual(mockTournament);
    expect(component.tournamentId()).toBe('123');
    // Rendering the tournament's data kicks off loading it
    await fixture.whenStable();
    expect(component.loading()).toBe(true);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockRegistrations);
    expect(component.loading()).toBe(false);
    expect(component.registrations()).toEqual(mockRegistrations);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    expect(component.loadingMatches()).toBe(true);
    req.flush(mockMatches);
    expect(component.loadingMatches()).toBe(false);
    expect(component.sc2matches()).toEqual(mockMatches);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockGroups);
    expect(component.groups()).toEqual(mockGroups);
  });

  it('should refresh groups', async () => {
    const mockGroups = [{ id: 'group1' }] as any[];

    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`).flush({ id: '123' });
    await fixture.whenStable();
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`).flush([]);

    component.refreshGroups();

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockGroups);
    expect(component.groups()).toEqual(mockGroups);
  });

  it('should refresh matches', async () => {
    const mockMatches = [{ id: 'match1' }] as any[];

    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`).flush({ id: '123' });
    await fixture.whenStable();
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`).flush([]);

    component.refreshMatches();

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockMatches);
    expect(component.sc2matches()).toEqual(mockMatches);
  });

  describe('rendering', () => {
    const tournamentUrl = () => `${apiService['_apiEndpoint']}/tournament?id=0313a19e-d527-46f9-bbea-08dd07ccaf69`;
    const regsUrl = () => `${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`;
    const matchesUrl = () => `${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`;
    const groupsUrl = () => `${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`;

    const registrations = [
      { id: 'r1', user: { id: 'u1', username: 'Alpha', sc2Details: { avatarUrl: 'alpha.png' } }, country: 'North Macedonia', companyId: 'ACME' },
      { id: 'r2', user: { id: 'u2', username: '' }, country: 'Serbia', battleTag: 'Beta#1234' }
    ];

    const loadTournament = async (data: { regs?: unknown[]; matches?: unknown[]; groups?: unknown[] } = {}) => {
      httpMock.expectOne(tournamentUrl()).flush({ id: '123', name: 'BGE Balkan Circuit' });
      await fixture.whenStable();
      httpMock.expectOne(regsUrl()).flush(data.regs ?? []);
      httpMock.expectOne(matchesUrl()).flush(data.matches ?? []);
      httpMock.expectOne(groupsUrl()).flush(data.groups ?? []);
      await fixture.whenStable();
    };

    const el = (): HTMLElement => fixture.nativeElement;
    // igx-avatar renders its image as the background of an inner element
    const avatarImage = (avatar: Element) => avatar.querySelector<HTMLElement>('.igx-avatar__image')?.style.backgroundImage;

    afterEach(() => {
      httpMock.verify();
    });

    it('should not load any tournament data before the tournament is known', () => {
      expect(component.tournamentId()).toBeUndefined();
      expect(component.registrations()).toBeUndefined();
      expect(component.groups()).toBeUndefined();
      expect(component.sc2matches()).toBeUndefined();
      expect(el().querySelector('[igxCardHeaderTitle]').textContent.trim()).toBe('');
      expect(el().querySelectorAll('.registration-slot').length).toBe(0);
      httpMock.expectOne(tournamentUrl()).flush(null);
    });

    it('should render the tournament name and a sign-up link to its registration page', async () => {
      await loadTournament();

      expect(el().querySelector('[igxCardHeaderTitle]').textContent.trim()).toBe('BGE Balkan Circuit');
      const signUp = el().querySelector('igx-card-header a[igxButton]');
      expect(signUp.textContent.trim()).toBe('Sign-up to participate');
      expect(signUp.getAttribute('href')).toBe('/registration/0313a19e-d527-46f9-bbea-08dd07ccaf69');
    });

    it('should show a progress indicator while the registrations are loading', async () => {
      httpMock.expectOne(tournamentUrl()).flush({ id: '123', name: 'BGE Balkan Circuit' });
      await fixture.whenStable();
      expect(el().querySelector('.participants-container igx-circular-bar')).toBeTruthy();

      httpMock.expectOne(regsUrl()).flush(registrations);
      httpMock.expectOne(matchesUrl()).flush([]);
      httpMock.expectOne(groupsUrl()).flush([]);
      await fixture.whenStable();
      expect(el().querySelector('.participants-container igx-circular-bar')).toBeNull();
    });

    it('should render the registered participants', async () => {
      await loadTournament({ regs: registrations });

      const slots = el().querySelectorAll('.registration-slot');
      expect(slots.length).toBe(2);

      const first = slots[0];
      const firstLink = first.querySelector('a');
      expect(firstLink.textContent.trim()).toBe('Alpha');
      expect(firstLink.getAttribute('href')).toBe('/players/u1/sc');
      expect(first.querySelector('span').textContent).toBe('[ACME]');
      const firstAvatars = first.querySelectorAll('igx-avatar');
      expect(firstAvatars[1].getAttribute('title')).toBe('North Macedonia');
      expect(avatarImage(first.querySelector('.country-badge-small'))).toContain('assets/country-flags/svg/north-macedonia.svg');

      // Without a username the participant's battle tag is shown, and there's no company tag
      const second = slots[1];
      expect(second.querySelector('a').textContent.trim()).toBe('Beta#1234');
      expect(second.querySelector('a').getAttribute('href')).toBe('/players/u2/sc');
      expect(second.querySelector('span')).toBeNull();
    });

    it('should render a participant without a user by their battle tag, without a profile link', async () => {
      await loadTournament({ regs: [{ id: 'r3', country: 'Greece', battleTag: 'Gamma#4321', companyId: 'ACME' }] });

      const slots = el().querySelectorAll('.registration-slot');
      expect(slots.length).toBe(1);
      expect(slots[0].querySelector('a')).toBeNull();
      expect(slots[0].querySelector('.participant-name').textContent.trim()).toBe('Gamma#4321');
      expect(slots[0].querySelector('.country-badge-small').getAttribute('title')).toBe('Greece');
      expect(slots[0].textContent).toContain('[ACME]');
    });

    it('should not render team brackets for participants without a team', async () => {
      await loadTournament({ regs: [
        { id: 'r4', country: 'Greece', battleTag: 'Delta#1', companyId: '' },
        { id: 'r5', country: 'Greece', battleTag: 'Echo#2', companyId: '(teamless)' },
        { id: 'r6', country: 'Greece', battleTag: 'Foxtrot#3', companyId: '  ' }
      ] });

      const slots = Array.from(el().querySelectorAll('.registration-slot'));
      expect(slots.length).toBe(3);
      slots.forEach(slot => {
        expect(slot.textContent).not.toContain('[');
        expect(slot.textContent).not.toContain('teamless');
      });
    });

    it('should leave the standings team cell empty for participants without a team', async () => {
      await loadTournament({
        groups: [{
          id: 'g1',
          name: 'Group A',
          participants: [{ id: 'p2', user: { username: 'Echo' }, country: 'Greece', companyId: '(teamless)', matches: 0, wins: 0, losses: 0, playerPoints: 0 }]
        }]
      });

      const cells = el().querySelector('.group-columns igx-grid igx-grid-row').querySelectorAll('igx-grid-cell');
      expect(cells[2].textContent.trim()).toBe('');
    });

    it('should name the icon-only refresh buttons', async () => {
      await loadTournament({ groups: [{ id: 'g1', name: 'Group A', participants: [] }] });

      expect(el().querySelector('igx-grid igx-grid-toolbar-actions button').getAttribute('aria-label')).toBe('Refresh matches');
      expect(el().querySelector('.group-columns igx-grid igx-grid-toolbar-actions button').getAttribute('aria-label')).toBe('Refresh standings');
    });

    it('should show the empty grid message when there are no matches', async () => {
      await loadTournament();

      const matchesGrid = el().querySelector('igx-grid');
      expect(matchesGrid.textContent).toContain('No matches found...');
      expect(matchesGrid.querySelectorAll('igx-grid-row').length).toBe(0);
      expect(el().querySelectorAll('.group-columns igx-grid').length).toBe(0);
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
          player2Race: 3,
          videoLink: 'https://youtube.com/watch?v=1',
          demoLink: 'https://replays.example/1'
        }]
      });

      const grid = el().querySelector('igx-grid');
      expect(grid.querySelectorAll('igx-grid-groupby-row').length).toBe(1);
      const row = grid.querySelector('igx-grid-row');
      const cells = row.querySelectorAll('igx-grid-cell');
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
      expect(avatarImage(players[1].querySelector('.avatar-no-background'))).toContain('assets/bge/race/zerg.png');

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

    it('should render the monthly standings of each group in reverse order', async () => {
      await loadTournament({
        groups: [
          { id: 'g1', name: 'Group A', participants: [] },
          {
            id: 'g2',
            name: 'Group B',
            participants: [
              { id: 'p1', user: { username: 'Alpha', sc2Details: { avatarUrl: 'alpha.png' } }, country: 'Bulgaria', companyId: 'ACME', matches: 3, wins: 2, losses: 1, playerPoints: 6 }
            ]
          }
        ]
      });

      const groupGrids = el().querySelectorAll('.group-columns igx-grid');
      expect(groupGrids.length).toBe(2);
      expect(groupGrids[0].querySelector('igx-grid-toolbar-title').textContent.trim()).toBe('Group B');
      expect(groupGrids[1].querySelector('igx-grid-toolbar-title').textContent.trim()).toBe('Group A');

      const cells = groupGrids[0].querySelector('igx-grid-row').querySelectorAll('igx-grid-cell');
      expect(cells[0].textContent.trim()).toBe('Alpha');
      expect(cells[1].textContent.trim()).toBe('Bulgaria');
      expect(avatarImage(cells[1].querySelector('igx-avatar'))).toContain('assets/country-flags/svg/bulgaria.svg');
      expect(cells[2].textContent.trim()).toBe('ACME');
      expect(cells[3].textContent.trim()).toBe('3');
      expect(cells[4].textContent.trim()).toBe('2');
      expect(cells[5].textContent.trim()).toBe('1');
      expect(cells[6].textContent.trim()).toBe('6');
      expect(groupGrids[1].querySelectorAll('igx-grid-row').length).toBe(0);
    });

    it('should re-fetch the matches when the matches refresh button is clicked', async () => {
      await loadTournament();

      const refresh: HTMLButtonElement = el().querySelector('igx-grid igx-grid-toolbar-actions button');
      refresh.click();

      const req = httpMock.expectOne(matchesUrl());
      expect(component.loadingMatches()).toBe(true);
      req.flush([{ id: 'm1', startTime: '2026-10-01T18:30:00', player1: { username: 'Alpha' }, player2: { username: 'Beta' } }]);
      await fixture.whenStable();
      expect(component.loadingMatches()).toBe(false);
      expect(el().querySelector('igx-grid').querySelectorAll('igx-grid-row').length).toBe(1);
    });

    it('should re-fetch the groups when a group refresh button is clicked', async () => {
      await loadTournament({ groups: [{ id: 'g1', name: 'Group A', participants: [] }] });

      const refresh: HTMLButtonElement = el().querySelector('.group-columns igx-grid igx-grid-toolbar-actions button');
      refresh.click();

      httpMock.expectOne(groupsUrl()).flush([
        { id: 'g1', name: 'Group A', participants: [] },
        { id: 'g2', name: 'Group B', participants: [] }
      ]);
      await fixture.whenStable();
      const titles = Array.from(el().querySelectorAll('.group-columns igx-grid-toolbar-title')).map(t => t.textContent.trim());
      expect(titles).toEqual(['Group B', 'Group A']);
    });
  });
});
