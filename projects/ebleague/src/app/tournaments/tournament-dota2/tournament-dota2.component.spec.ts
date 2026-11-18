import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDota2Component } from './tournament-dota2.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { ApiTournamentsService, LoginService } from 'bellum-gens-common/services';
import {
  ApplicationUser,
  Tournament,
  TournamentDota2Group,
  TournamentDota2Match,
  TournamentParticipant,
  TournamentApplicationState,
  CSGOTeam
} from 'bellum-gens-common/models';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

const team = (teamId: string, teamName: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: `https://example.com/${teamId}.png`,
  customUrl: `${teamId}-url`,
  visible: true
});

const makeRegistration = (id: string, userId: string, state: TournamentApplicationState, t: CSGOTeam): TournamentParticipant => ({
  id,
  userId,
  state,
  team: t,
  teamId: t.teamId,
  companyId: `${t.teamName} Inc.`
});

describe('TournamentDota2Component', () => {
  let component: TournamentDota2Component;
  let fixture: ComponentFixture<TournamentDota2Component>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let loginService: LoginService;
  let params: BehaviorSubject<Params>;

  const el = (): HTMLElement => fixture.nativeElement;
  const api = (path: string) => `${apiService['_apiEndpoint']}/tournament/${path}`;
  const grids = () => Array.from(el().querySelectorAll<HTMLElement>('igx-grid'));
  const activeTournamentUrl = () => api('activetournament');
  const scheduleGrid = () => fixture.debugElement.queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
    .map(debugEl => debugEl.componentInstance as IgxGridComponent)
    .find(g => g.data === component.dota2matches())!;

  /** Answers the requests the page issues on load (or on a route change) for the given tournament id. */
  const flushPage = (query: string, data: {
    tournament?: Tournament;
    registrations?: TournamentParticipant [];
    matches?: TournamentDota2Match [];
    groups?: TournamentDota2Group [];
  } = {}) => {
    httpMock.expectOne(api(`dota2regs${query}`)).flush(data.registrations ?? []);
    httpMock.expectOne(api(`dota2matches${query}`)).flush(data.matches ?? []);
    httpMock.expectOne(api(`dota2groups${query}`)).flush(data.groups ?? []);
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
        TournamentDota2Component
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params, data: of({}) } }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
    loginService = TestBed.inject(LoginService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDota2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const flushUser = (user: Partial<ApplicationUser> | null) =>
    httpMock.expectOne(loginService['_apiEndpoint']).flush(user);

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.environment).toBeDefined();
  });

  it('loads the active tournament data when the route carries no tournament id', async () => {
    expect(component.tournamentId()).toBe('');
    flushUser(null);
    // An empty id loads the active tournament rather than requesting `/tournament?id=undefined`
    httpMock.expectNone(req => req.url.includes('/tournament?id='));
    httpMock.expectOne(activeTournamentUrl()).flush({ id: 'active', name: 'Spring' });
    flushPage('');
    httpMock.verify();
    await render();

    expect(component.tournament()!.name).toBe('Spring');
    expect(el().querySelector('h1[igxCardHeaderTitle]')!.textContent).toContain('Spring Dota 2 League');
    expect(el().querySelector('igx-grid-toolbar-title')!.textContent).toContain('Spring Schedule');
    expect(el().querySelector('igx-card-header igx-avatar')!.getAttribute('src')).toBe('/assets/wallpapers/dota2-icon.png');
  });

  it('fetches the tournament, registrations, series and groups for the routed tournament id', async () => {
    flushUser(null);
    httpMock.match(() => true).forEach(req => req.flush(null));

    params.next({ tournamentid: 't1' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.tournamentId()).toBe('t1');
    const tournamentReq = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament?id=t1`);
    expect(tournamentReq.request.method).toBe('GET');
    tournamentReq.flush({ id: 't1', name: 'Season 2' });

    expect(component.loading()).toBe(true);
    expect(component.loadingMatches()).toBe(true);
    expect(component.loadingGroups()).toBe(true);
    flushPage('?tournamentId=t1', {
      registrations: [makeRegistration('r1', 'u1', TournamentApplicationState.Confirmed, team('team-1', 'Alpha'))]
    });
    httpMock.verify();
    expect(component.loading()).toBe(false);
    expect(component.loadingMatches()).toBe(false);
    expect(component.loadingGroups()).toBe(false);
    await render();

    expect(component.registrations()!.length).toBe(1);
    expect(el().querySelector('h1[igxCardHeaderTitle]')!.textContent).toContain('Season 2 Dota 2 League');
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

  it('renders every registered team and flags only the current user\'s unconfirmed one', async () => {
    flushUser({ id: 'me' });
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    flushPage('', {
      registrations: [
        makeRegistration('r1', 'me', TournamentApplicationState.Pending, team('team-1', 'Alpha')),
        makeRegistration('r2', 'me', TournamentApplicationState.Confirmed, team('team-2', 'Bravo')),
        { ...makeRegistration('r3', 'other', TournamentApplicationState.Pending, team('team-3', 'Charlie')), companyId: '' }
      ]
    });
    await render();

    const slots = Array.from(el().querySelectorAll('.registration-slot'));
    expect(slots.length).toBe(3);
    expect(slots.map(s => !!s.querySelector('igx-badge'))).toEqual([true, false, false]);

    const link = slots[0].querySelector<HTMLAnchorElement>('a')!;
    expect(link.textContent.trim()).toBe('Alpha');
    expect(link.getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-1-url`);
    // The company is only shown for the teams that have one
    expect(slots.map(s => s.querySelector(':scope > span')?.textContent ?? null)).toEqual(['[Alpha Inc.]', '[Bravo Inc.]', null]);
  });

  describe('schedule', () => {
    const alpha = team('team-1', 'Alpha');
    const bravo = team('team-2', 'Bravo');
    let matches: TournamentDota2Match [];

    const rows = () => Array.from(grids()[0].querySelectorAll('igx-grid-row'));
    const teamLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.grid-team-name'));
    const details = () => Array.from(grids()[0].querySelectorAll('.igx-grid__tr-container'));
    const detailText = (detail: Element) => detail.textContent.replace(/\s+/g, ' ').trim();

    beforeEach(async () => {
      matches = [
        {
          id: 'm1', team1: alpha, team2: bravo, team1Id: 'team-1', team2Id: 'team-2', team1Points: 2, team2Points: 1,
          winnerTeamId: 'team-1', startTime: new Date(2024, 0, 15, 18, 30), videoLink: 'https://video/1', demoLink: 'https://demo/1',
          games: [
            // The games come in any order and are listed by their number
            { id: 'g3', dota2MatchId: 'm1', gameNumber: 3, radiantTeamId: 'team-1', winnerTeamId: 'team-1', steamMatchId: 7300000003 },
            { id: 'g1', dota2MatchId: 'm1', gameNumber: 1, radiantTeamId: 'team-1', winnerTeamId: 'team-1', steamMatchId: 7300000001 },
            { id: 'g2', dota2MatchId: 'm1', gameNumber: 2, radiantTeamId: 'team-2', winnerTeamId: 'team-2', steamMatchId: null }
          ]
        },
        {
          id: 'm2', team1: alpha, team2: bravo, team1Id: 'team-1', team2Id: 'team-2', team1Points: 1, team2Points: 1,
          winnerTeamId: EMPTY_GUID, startTime: new Date(2024, 0, 16, 18, 30),
          games: [
            { id: 'g4', dota2MatchId: 'm2', gameNumber: 1, radiantTeamId: 'team-2', winnerTeamId: 'team-1' },
            { id: 'g5', dota2MatchId: 'm2', gameNumber: 2, radiantTeamId: 'team-1', winnerTeamId: 'team-2' }
          ]
        },
        {
          id: 'm3', team1: bravo, team2: alpha, team1Id: 'team-2', team2Id: 'team-1', winnerTeamId: 'team-1',
          noShow: true, startTime: new Date(2024, 0, 17, 18, 30), games: []
        },
        {
          id: 'm4', team1: alpha, team2: bravo, team1Id: 'team-1', team2Id: 'team-2', team1Points: 0, team2Points: 0,
          winnerTeamId: EMPTY_GUID, startTime: new Date(2024, 0, 18, 18, 30)
        }
      ];
      flushUser(null);
      httpMock.expectOne(activeTournamentUrl()).flush(null);
      flushPage('', { matches });
      await render();
    });

    it('renders a row per series with the teams, the series score and the winner highlighted', () => {
      expect(component.dota2matches()).toEqual(matches);
      expect(rows().length).toBe(4);

      expect(teamLinks(rows()[0]).map(a => a.textContent.trim())).toEqual(['Alpha', 'Bravo']);
      expect(teamLinks(rows()[0])[1].getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-2-url`);
      // A drawn or unplayed series carries the empty GUID as its winner, so neither team is highlighted
      expect(rows().map(row => teamLinks(row).map(a => a.classList.contains('color-success')))).toEqual([
        [true, false],
        [false, false],
        [false, true],
        [false, false]
      ]);
      expect(rows().map(row => row.querySelector('.grid-vs-divider')!.textContent.trim())).toEqual(['2 : 1', '1 : 1', 'vs.', 'vs.']);
      expect(rows()[0].querySelectorAll('igx-avatar').length).toBe(2);
      expect(rows()[0].textContent).toContain('Jan 15, 2024, 6:30 PM');
    });

    it('shows the video and replay links only for the series that have them', () => {
      const mediaLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.horizontal-center'))
        .map(a => a.getAttribute('href'));

      expect(mediaLinks(rows()[0])).toEqual(['https://video/1', 'https://demo/1']);
      expect(mediaLinks(rows()[1])).toEqual([]);
    });

    it('lists the games of a series in order with the sides, the winner and the Steam match id', async () => {
      scheduleGrid().expandAll();
      await render();

      expect(details().length).toBe(4);
      const tables = Array.from(grids()[0].querySelectorAll<HTMLTableElement>('table.series-games'));
      expect(tables.length).toBe(2);
      expect(Array.from(tables[0].querySelectorAll('th')).map(th => [th.textContent.trim(), th.getAttribute('scope')])).toEqual([
        ['Game', 'col'], ['Radiant', 'col'], ['Dire', 'col'], ['Winner', 'col'], ['Steam match ID', 'col']
      ]);
      const cells = (table: HTMLTableElement) => Array.from(table.querySelectorAll('tbody tr'))
        .map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim()));
      expect(cells(tables[0])).toEqual([
        ['1', 'Alpha', 'Bravo', 'Alpha', '7300000001'],
        ['2', 'Bravo', 'Alpha', 'Bravo', ''],
        ['3', 'Alpha', 'Bravo', 'Alpha', '7300000003']
      ]);
      expect(cells(tables[1])).toEqual([
        ['1', 'Bravo', 'Alpha', 'Alpha', ''],
        ['2', 'Alpha', 'Bravo', 'Bravo', '']
      ]);
      // The winner of each game is highlighted
      expect(tables[0].querySelector('tbody td:nth-child(4)')!.classList).toContain('color-success');
    });

    it('reports drawn, walked over and unplayed series in the row details', async () => {
      scheduleGrid().expandAll();
      await render();

      const text = details().map(detailText);
      expect(text[0]).not.toContain('draw');
      expect(text[1]).toContain('The series ended in a draw');
      expect(text[2]).toContain('Walkover');
      // A walkover is never reported as an unplayed series
      expect(text[2]).not.toContain('The match has not been played yet');
      expect(text[3]).toContain('The match has not been played yet');
      expect(text.filter(t => t.includes('The match has not been played yet')).length).toBe(1);
    });
  });

  it('renders a standings grid per group with the Dota 2 columns and a colour-coded game difference', async () => {
    // The API also sends the number of series each team played
    const participant = (id: string, t: CSGOTeam, record: Partial<TournamentParticipant> & { matches?: number }): TournamentParticipant => ({
      ...makeRegistration(id, `u-${id}`, TournamentApplicationState.Confirmed, t),
      ...record
    });
    const groups: TournamentDota2Group [] = [
      {
        id: 'g1', name: 'Group A', participants: [
          participant('p1', team('team-1', 'Alpha'), { matches: 2, wins: 1, draws: 1, losses: 0, teamPoints: 3, gameDifference: 2 }),
          participant('p2', team('team-2', 'Bravo'), { matches: 2, wins: 0, draws: 1, losses: 1, teamPoints: 1, gameDifference: -2 }),
          participant('p3', team('team-3', 'Charlie'), { matches: 0, wins: 0, draws: 0, losses: 0, teamPoints: 0, gameDifference: 0 })
        ]
      },
      { id: 'g2', name: 'Group B', participants: [] }
    ];
    flushUser(null);
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    flushPage('', { groups });
    await render();

    const groupGrids = Array.from(el().querySelectorAll<HTMLElement>('.group-columns igx-grid'));
    expect(groupGrids.length).toBe(2);
    expect(groupGrids.map(g => g.querySelector('igx-grid-toolbar-title')!.textContent.trim())).toEqual(['Group A', 'Group B']);

    const standings = fixture.debugElement.queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
      .map(debugEl => debugEl.componentInstance as IgxGridComponent)
      .find(g => g.data === groups[0].participants)!;
    expect(standings.columns.map(c => [c.field, c.header])).toEqual([
      ['team', 'Team'],
      ['companyId', 'Company'],
      ['matches', 'Matches'],
      ['wins', 'Wins'],
      ['draws', 'Draws'],
      ['losses', 'Losses'],
      ['gameDifference', 'Game Diff'],
      ['teamPoints', 'Points']
    ]);

    const teamLinks = Array.from(groupGrids[0].querySelectorAll<HTMLAnchorElement>('a[igxListLineTitle]'));
    expect(teamLinks.map(a => a.textContent.trim())).toEqual(['Alpha', 'Bravo', 'Charlie']);
    expect(teamLinks[1].getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-2-url`);

    const rows = Array.from(groupGrids[0].querySelectorAll('igx-grid-row'));
    const diffClass = (row: Element) => {
      const span = Array.from(row.querySelectorAll('span')).find(s => /^-?\d+$/.test(s.textContent.trim()));
      return span!.className;
    };
    expect(rows.map(diffClass)).toEqual(['color-success', 'color-error', '']);
    expect(rows[0].textContent).toContain('Alpha Inc.');
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
    expect(component.tournament()!.name).toBe('Season 3');
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
      fixture = TestBed.createComponent(TournamentDota2Component);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('moves the media links from their columns to the series details and shortens the start time', async () => {
      const matches: TournamentDota2Match [] = [{
        id: 'm1', team1: team('team-1', 'Alpha'), team2: team('team-2', 'Bravo'), team1Id: 'team-1', team2Id: 'team-2',
        startTime: new Date(2024, 0, 15, 18, 30), videoLink: 'https://video/1', demoLink: 'https://demo/1', games: []
      }];
      httpMock.match(req => req.url.includes('dota2matches')).forEach(req => req.flush(matches));
      httpMock.match(() => true).forEach(req => req.flush(null));
      await render();

      expect(component.narrowScreen()).toBe(true);
      const grid = scheduleGrid();
      expect(grid.getColumnByName('videoLink').hidden).toBe(true);
      expect(grid.getColumnByName('demoLink').hidden).toBe(true);
      expect(grid.getColumnByName('startTime').width).toBe('150px');

      const row = grids()[0].querySelector('igx-grid-row')!;
      expect(row.textContent).toMatch(/1\/15\/24, 6:30\sPM/);
      expect(row.querySelectorAll('a.horizontal-center').length).toBe(0);

      grid.expandAll();
      await render();
      const links = Array.from(grids()[0].querySelectorAll<HTMLAnchorElement>('.match-links a'));
      expect(links.map(a => [a.getAttribute('href'), a.querySelector('span')!.textContent.trim()])).toEqual([
        ['https://video/1', 'Video'],
        ['https://demo/1', 'Replay']
      ]);
    });
  });
});
