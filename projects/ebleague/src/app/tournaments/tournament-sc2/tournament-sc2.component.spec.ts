import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSc2Component } from './tournament-sc2.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import {
  ApiTournamentsService,
  ApplicationUser,
  LoginService,
  Tournament,
  TournamentSC2Group,
  TournamentSC2Match,
  TournamentParticipant,
  TournamentApplicationState
} from '../../../../../common/src/public_api';
import { SC2Map } from '../../../../../common/src/models/sc2maps';
import { CSGODetails } from '../../../../../common/src/models/csgoplayer';

const player = (id: string, username: string, overrides: Partial<ApplicationUser> = {}): ApplicationUser => ({
  id,
  username,
  steamId: null,
  battleNetId: null,
  email: null,
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  ...overrides
});

const makeRegistration = (id: string, userId: string, state: TournamentApplicationState, user: ApplicationUser,
                          battleTag: string): TournamentParticipant => ({
  id,
  userId,
  state,
  user,
  battleTag,
  companyId: `${user.username} Inc.`
});

describe('TournamentSc2Component', () => {
  let component: TournamentSc2Component;
  let fixture: ComponentFixture<TournamentSc2Component>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let loginService: LoginService;
  let params: BehaviorSubject<Params>;

  const el = (): HTMLElement => fixture.nativeElement;
  const api = (path: string) => `${apiService['_apiEndpoint']}/tournament/${path}`;

  const flushUser = (user: Partial<ApplicationUser> | null) =>
    httpMock.expectOne(loginService['_apiEndpoint']).flush(user);

  /** Answers the active tournament request a page without a routed tournament id issues. */
  const flushTournament = (tournament: Tournament | null) =>
    httpMock.expectOne(api('activetournament')).flush(tournament);

  /** Answers the requests the page issues on load (or on a route change) for the given tournament id. */
  const flushPage = (query: string, data: {
    registrations?: TournamentParticipant [];
    matches?: TournamentSC2Match [];
    groups?: TournamentSC2Group [];
  } = {}) => {
    httpMock.expectOne(api(`sc2regs${query}`)).flush(data.registrations ?? []);
    httpMock.expectOne(api(`sc2matches${query}`)).flush(data.matches ?? []);
    httpMock.expectOne(api(`sc2groups${query}`)).flush(data.groups ?? []);
  };

  const render = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    params = new BehaviorSubject<Params>({});

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TournamentSc2Component
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params, data: of({}) } }
    ]
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
    loginService = TestBed.inject(LoginService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the active tournament data when the route carries no tournament id', async () => {
    expect(component.tournamentId()).toBeUndefined();
    flushUser(null);
    // An empty id loads the active tournament rather than requesting `/tournament?id=undefined`
    httpMock.expectNone(req => req.url.includes('/tournament?id='));
    flushTournament({ id: 'active', name: 'StarCraft II League' });
    flushPage('');
    httpMock.verify();
    await render();

    expect(component.tournament().name).toBe('StarCraft II League');
    expect(el().querySelector('h1[igxCardHeaderTitle]').textContent.trim()).toBe('StarCraft II League');
    expect(el().querySelector('igx-grid-toolbar-title').textContent).toContain('StarCraft II League Schedule');
  });

  it('fetches the tournament, registrations, matches and groups for the routed tournament id', async () => {
    flushUser(null);
    httpMock.match(() => true).forEach(req => req.flush(null));

    params.next({ tournamentid: 't1' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.tournamentId()).toBe('t1');
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=t1`).flush({ id: 't1', name: 'Season 2' });

    expect(component.loading()).toBe(true);
    expect(component.loadingMatches()).toBe(true);
    expect(component.loadingGroups()).toBe(true);
    flushPage('?tournamentId=t1', {
      groups: [{ id: 'g1', name: 'Group A' }, { id: 'g2', name: 'Group B' }]
    });
    httpMock.verify();
    expect(component.loading()).toBe(false);
    expect(component.loadingMatches()).toBe(false);
    expect(component.loadingGroups()).toBe(false);

    // Groups are listed newest first
    expect(component.groups().map(g => g.id)).toEqual(['g2', 'g1']);
    expect(component.tournament().name).toBe('Season 2');
  });

  it('shows a progress bar while the registrations are loading', async () => {
    flushUser(null);
    await render();
    expect(component.loading()).toBe(true);
    expect(el().querySelector('.participants-container igx-circular-bar')).not.toBeNull();

    httpMock.match(() => true).forEach(req => req.flush(null));
    await render();
    expect(component.loading()).toBe(false);
    expect(el().querySelector('.participants-container igx-circular-bar')).toBeNull();
  });

  it('renders every registration and flags only the current user\'s pending one', async () => {
    const withAvatar = player('me', 'Serral', {
      sc2Details: { avatarUrl: 'https://example.com/serral.png' } as ApplicationUser['sc2Details'],
      csgoDetails: { customUrl: 'serral' } as CSGODetails
    });
    flushUser({ id: 'me' });
    flushTournament(null);
    flushPage('', {
      registrations: [
        makeRegistration('r1', 'me', TournamentApplicationState.Pending, withAvatar, 'Serral#1234'),
        makeRegistration('r2', 'me', TournamentApplicationState.Confirmed, player('me', 'Serral'), 'Serral#5678'),
        makeRegistration('r3', 'other', TournamentApplicationState.Pending, player('other', 'Maru'), 'Maru#1111'),
        // A registration whose user account is gone still renders
        { id: 'r4', userId: 'gone', state: TournamentApplicationState.Confirmed, user: null, battleTag: 'Ghost#0000', companyId: 'Ghost Inc.' }
      ]
    });
    await render();

    const slots = Array.from(el().querySelectorAll('.registration-slot'));
    expect(slots.length).toBe(4);
    expect(slots.map(s => !!s.querySelector('igx-badge'))).toEqual([true, false, false, false]);

    // StarCraft II players link to the StarCraft II tab of their profile by user id, never by a Counter-Strike url
    const links = slots.map(s => s.querySelector<HTMLAnchorElement>('a'));
    expect(links.map(a => a.textContent.trim())).toEqual(['Serral#1234', 'Serral#5678', 'Maru#1111', 'Ghost#0000']);
    expect(links[0].getAttribute('href')).toBe(`${component.environment.bellumgens}/players/me/sc`);
    expect(links[2].getAttribute('href')).toBe(`${component.environment.bellumgens}/players/other/sc`);
    expect(links[3].getAttribute('href')).toBe(`${component.environment.bellumgens}/players/gone/sc`);
    expect(slots[2].querySelector(':scope > span').textContent).toBe('[Maru Inc.]');

    // Players without a StarCraft II avatar fall back to their initials
    const avatars = slots.map(s => s.querySelector<HTMLElement>('igx-avatar'));
    expect(avatars[0].querySelector<HTMLElement>('.igx-avatar__image').style.backgroundImage).toContain('https://example.com/serral.png');
    expect(avatars[2].classList).toContain('igx-avatar--initials');
    expect(avatars[2].textContent.trim()).toBe('Ma');
  });

  it('renders a standings grid per group with links to every player', async () => {
    const participant = (id: string, user: ApplicationUser): TournamentParticipant => ({
      ...makeRegistration(id, user.id, TournamentApplicationState.Confirmed, user, `${user.username}#1`),
      playerPoints: 3
    });
    flushUser(null);
    flushTournament(null);
    flushPage('', {
      groups: [
        { id: 'g1', name: 'Group A', participants: [
          participant('p1', player('u1', 'Serral', {
            sc2Details: { avatarUrl: 'https://example.com/serral.png' } as ApplicationUser['sc2Details']
          })),
          participant('p2', player('u2', 'Maru')),
          { id: 'p3', userId: 'u3', state: TournamentApplicationState.Confirmed, user: null, battleTag: 'Ghost#1', companyId: 'Ghost Inc.' }
        ] },
        { id: 'g2', name: 'Group B', participants: [] }
      ]
    });
    await render();

    const groupGrids = Array.from(el().querySelectorAll<HTMLElement>('.group-columns igx-grid'));
    // The API returns groups oldest first and the page shows them newest first
    expect(groupGrids.map(g => g.querySelector('igx-grid-toolbar-title').textContent.trim())).toEqual(['Group B', 'Group A']);

    const playerLinks = Array.from(groupGrids[1].querySelectorAll<HTMLAnchorElement>('a[igxListLineTitle]'));
    expect(playerLinks.map(a => a.textContent.trim())).toEqual(['Serral', 'Maru', '']);
    // Players are linked by user id (falling back to the participant's), as ApplicationUser has no custom url
    expect(playerLinks.map(a => a.getAttribute('href'))).toEqual([
      `${component.environment.bellumgens}/players/u1/sc`,
      `${component.environment.bellumgens}/players/u2/sc`,
      `${component.environment.bellumgens}/players/u3/sc`
    ]);
    const avatars = Array.from(groupGrids[1].querySelectorAll<HTMLElement>('igx-avatar'));
    expect(avatars[0].querySelector<HTMLElement>('.igx-avatar__image').style.backgroundImage).toContain('https://example.com/serral.png');
    expect(avatars[1].classList).toContain('igx-avatar--initials');
  });

  it('renders the schedule with winners highlighted, media links and match details', async () => {
    const serral = { ...player('p1', 'Serral'), avatarUrl: 'https://example.com/serral.png' };
    const maru = player('p2', 'Maru');
    const matches: TournamentSC2Match [] = [
      {
        id: 'm1', player1: serral, player2: maru, player1Id: 'p1', player2Id: 'p2', player1Points: 2, player2Points: 1,
        startTime: new Date(2024, 0, 15, 18, 30), videoLink: 'https://video/1', demoLink: 'https://replay/1',
        maps: [
          { id: 'map1', map: SC2Map.TritonLE, winnerId: 'p1' },
          { id: 'map2', map: SC2Map.ZenLE, winnerId: 'p2' }
        ]
      },
      {
        id: 'm2', player1: serral, player2: maru, player1Id: 'p1', player2Id: 'p2', player1Points: 0, player2Points: 2,
        noShow: true, maps: []
      },
      { id: 'm3', player1: maru, player2: serral, player1Id: 'p2', player2Id: 'p1', player1Points: 0, player2Points: 0, maps: [] }
    ];
    flushUser(null);
    flushTournament(null);
    flushPage('', { matches });
    await render();

    expect(component.sc2matches()).toEqual(matches);
    const schedule = Array.from(el().querySelectorAll<HTMLElement>('igx-grid')).find(g => !g.closest('.group-columns'));
    const rows = Array.from(schedule.querySelectorAll('igx-grid-row'));
    expect(rows.length).toBe(3);

    const names = (row: Element) => Array.from(row.querySelectorAll<HTMLElement>('span.grid-team-name'));
    expect(names(rows[0]).map(s => s.classList.contains('color-success'))).toEqual([true, false]);
    expect(names(rows[1]).map(s => s.classList.contains('color-success'))).toEqual([false, true]);
    expect(names(rows[2]).map(s => s.classList.contains('color-success'))).toEqual([false, false]);
    expect(names(rows[0]).map(s => s.textContent.trim())).toEqual(['Serral', 'Maru']);

    // Video and replay cells only show a link when the match has one
    const mediaLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.horizontal-center'))
      .map(a => a.getAttribute('href'));
    expect(mediaLinks(rows[0])).toEqual(['https://video/1', 'https://replay/1']);
    expect(mediaLinks(rows[1])).toEqual([]);
    expect(rows[0].textContent).toContain('Jan 15, 2024, 6:30 PM');

    const grid = fixture.debugElement.queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
      .map(debugEl => debugEl.componentInstance as IgxGridComponent)
      .find(g => g.data === component.sc2matches());
    grid.expandAll();
    await render();

    const text = schedule.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Triton LE');
    expect(text).toContain('Zen LE');
    expect(text).toContain('Walkover');
    // A walkover is never reported as an unplayed match
    expect(text.split('The match has not been played yet').length - 1).toBe(1);

    // Each map shows a check on the side of the player who won it
    const mapRows = Array.from(schedule.querySelectorAll('.horizontal-center'))
      .filter(r => r.querySelectorAll(':scope > .score-container').length === 2);
    expect(mapRows.map(r => Array.from(r.querySelectorAll('.score-container')).map(c => !!c.querySelector('igx-icon'))))
      .toEqual([[true, false], [false, true]]);
  });

  it('re-fetches the results when the routed tournament changes', async () => {
    flushUser(null);
    httpMock.match(() => true).forEach(req => req.flush(null));

    params.next({ tournamentid: 't1' });
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.match(() => true).forEach(req => req.flush(null));

    params.next({ tournamentid: 't2' });
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=t2`).flush({ id: 't2', name: 'Season 3' });
    flushPage('?tournamentId=t2');
    httpMock.verify();
    expect(component.tournament().name).toBe('Season 3');
  });

  it('hides the team brackets for players without a team', async () => {
    flushUser(null);
    flushTournament(null);
    flushPage('', {
      registrations: [
        makeRegistration('r1', 'u1', TournamentApplicationState.Confirmed, player('u1', 'Serral'), 'Serral#1'),
        { ...makeRegistration('r2', 'u2', TournamentApplicationState.Confirmed, player('u2', 'Maru'), 'Maru#1'), companyId: null }
      ]
    });
    await render();

    const slots = Array.from(el().querySelectorAll('.registration-slot'));
    expect(slots.map(s => s.querySelector(':scope > span')?.textContent ?? null)).toEqual(['[Serral Inc.]', null]);
    expect(el().querySelector('.participants-container').textContent).not.toContain('[]');
  });

  describe('on a narrow screen', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      // Answer the requests of the instance the outer setup created before the screen size was mocked
      httpMock.match(() => true).forEach(req => req.flush(null));
      fixture.destroy();
      originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }) as unknown as typeof window.matchMedia;
      fixture = TestBed.createComponent(TournamentSc2Component);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('moves the media links from their columns to the match details and shortens the start time', async () => {
      const matches: TournamentSC2Match [] = [{
        id: 'm1', player1: player('p1', 'Serral'), player2: player('p2', 'Maru'), player1Id: 'p1', player2Id: 'p2',
        player1Points: 0, player2Points: 0, startTime: new Date(2024, 0, 15, 18, 30),
        videoLink: 'https://video/1', demoLink: 'https://replay/1', maps: []
      }];
      httpMock.match(req => req.url.includes('sc2matches')).forEach(req => req.flush(matches));
      httpMock.match(() => true).forEach(req => req.flush(null));
      await render();

      expect(component.narrowScreen()).toBe(true);
      const grid = fixture.debugElement.queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
        .map(debugEl => debugEl.componentInstance as IgxGridComponent)
        .find(g => g.data === component.sc2matches());
      expect(grid.getColumnByName('videoLink').hidden).toBe(true);
      expect(grid.getColumnByName('demoLink').hidden).toBe(true);
      expect(grid.getColumnByName('startTime').width).toBe('150px');

      const schedule = Array.from(el().querySelectorAll<HTMLElement>('igx-grid')).find(g => !g.closest('.group-columns'));
      const row = schedule.querySelector('igx-grid-row');
      expect(row.textContent).toMatch(/1\/15\/24, 6:30\sPM/);
      expect(row.querySelectorAll('a.horizontal-center').length).toBe(0);

      grid.expandAll();
      await render();
      const links = Array.from(schedule.querySelectorAll<HTMLAnchorElement>('.match-links a'));
      expect(links.map(a => [a.getAttribute('href'), a.querySelector('span').textContent.trim()])).toEqual([
        ['https://video/1', 'Video'],
        ['https://replay/1', 'Replay']
      ]);
    });
  });
});
