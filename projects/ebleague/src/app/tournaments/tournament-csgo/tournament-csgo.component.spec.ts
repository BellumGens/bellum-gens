import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
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
  TournamentCSGOGroup,
  TournamentCSGOMatch,
  TournamentParticipant,
  TournamentApplicationState
} from '../../../../../common/src/public_api';
import { CSGOMap } from '../../../../../common/src/models/csgomaps';
import { CSGOTeam } from '../../../../../common/src/models/csgoteam';

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

describe('TournamentCsgoComponent', () => {
  let component: TournamentCsgoComponent;
  let fixture: ComponentFixture<TournamentCsgoComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let loginService: LoginService;
  let params: BehaviorSubject<Params>;

  const el = (): HTMLElement => fixture.nativeElement;
  const api = (path: string) => `${apiService['_apiEndpoint']}/tournament/${path}`;
  const grids = () => Array.from(el().querySelectorAll<HTMLElement>('igx-grid'));
  const activeTournamentUrl = () => api('activetournament');

  /** Answers the requests the page issues on load (or on a route change) for the given tournament id. */
  const flushPage = (query: string, data: {
    tournament?: Tournament;
    registrations?: TournamentParticipant [];
    matches?: TournamentCSGOMatch [];
    groups?: TournamentCSGOGroup [];
  } = {}) => {
    httpMock.expectOne(api(`csgoregs${query}`)).flush(data.registrations ?? []);
    httpMock.expectOne(api(`csgomatches${query}`)).flush(data.matches ?? []);
    httpMock.expectOne(api(`csgogroups${query}`)).flush(data.groups ?? []);
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
        TournamentCsgoComponent
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
    fixture = TestBed.createComponent(TournamentCsgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const flushUser = (user: Partial<ApplicationUser> | null) =>
    httpMock.expectOne(loginService['_apiEndpoint']).flush(user);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have environment property', () => {
    expect(component.environment).toBeDefined();
  });

  it('loads the active tournament data when the route carries no tournament id', async () => {
    expect(component.tournamentId()).toBeUndefined();
    flushUser(null);
    // An empty id loads the active tournament rather than requesting `/tournament?id=undefined`
    httpMock.expectNone(req => req.url.includes('/tournament?id='));
    httpMock.expectOne(activeTournamentUrl()).flush({ id: 'active', name: 'Spring' });
    flushPage('');
    httpMock.verify();
    await render();

    expect(component.tournament().name).toBe('Spring');
    expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('Spring Counter-Strike League');
    expect(el().querySelector('igx-grid-toolbar-title').textContent).toContain('Spring Schedule');
  });

  it('fetches the tournament, registrations, matches and groups for the routed tournament id', async () => {
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
    flushPage('?tournamentId=t1', {
      registrations: [makeRegistration('r1', 'u1', TournamentApplicationState.Confirmed, team('team-1', 'Alpha'))]
    });
    httpMock.verify();
    expect(component.loading()).toBe(false);
    expect(component.loadingMatches()).toBe(false);
    await render();

    expect(component.registrations().length).toBe(1);
    expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('Season 2 Counter-Strike League');
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

  it('tracks the registrations and groups loading separately', async () => {
    flushUser(null);
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    await render();
    expect(component.loading()).toBe(true);
    expect(component.loadingGroups()).toBe(true);

    // The groups answering first must not stop the participants spinner
    httpMock.expectOne(api('csgogroups')).flush([{ id: 'g1', name: 'Group A', participants: [] }]);
    await render();
    expect(component.loadingGroups()).toBe(false);
    expect(component.loading()).toBe(true);
    expect(el().querySelector('.participants-container igx-circular-bar')).not.toBeNull();

    httpMock.expectOne(api('csgoregs')).flush([]);
    httpMock.expectOne(api('csgomatches')).flush([]);
    await render();
    expect(component.loading()).toBe(false);
    expect(el().querySelector('.participants-container igx-circular-bar')).toBeNull();
  });

  it('marks the group grids as loading while the groups are re-fetched', async () => {
    flushUser(null);
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    flushPage('', { groups: [{ id: 'g1', name: 'Group A', participants: [] }] });
    await render();

    const groupGrid = () => fixture.debugElement
      .queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
      .map(debugEl => debugEl.componentInstance as IgxGridComponent)
      .find(g => g.data === component.groups()[0].participants);
    expect(groupGrid().isLoading).toBe(false);

    apiService.refreshCsgoGroups(undefined);
    await render();
    expect(component.loadingGroups()).toBe(true);
    expect(component.loading()).toBe(false);
    expect(groupGrid().isLoading).toBe(true);

    httpMock.expectOne(api('csgogroups')).flush([{ id: 'g1', name: 'Group A', participants: [] }]);
    await render();
    expect(groupGrid().isLoading).toBe(false);
  });

  it('renders every registration and flags only the current user\'s unconfirmed one', async () => {
    const alpha = team('team-1', 'Alpha');
    const bravo = team('team-2', 'Bravo');
    const charlie = team('team-3', 'Charlie');
    flushUser({ id: 'me' });
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    flushPage('', {
      registrations: [
        makeRegistration('r1', 'me', TournamentApplicationState.Pending, alpha),
        makeRegistration('r2', 'me', TournamentApplicationState.Confirmed, bravo),
        makeRegistration('r3', 'other', TournamentApplicationState.Pending, charlie)
      ]
    });
    await render();

    const slots = Array.from(el().querySelectorAll('.registration-slot'));
    expect(slots.length).toBe(3);
    expect(slots.map(s => !!s.querySelector('igx-badge'))).toEqual([true, false, false]);

    const link = slots[0].querySelector<HTMLAnchorElement>('a');
    expect(link.textContent.trim()).toBe('Alpha');
    expect(link.getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-1-url`);
    expect(slots[0].querySelector('span').textContent).toBe('[Alpha Inc.]');
  });

  it('renders the schedule with winners highlighted, media links and match details', async () => {
    const alpha = team('team-1', 'Alpha');
    const bravo = team('team-2', 'Bravo');
    const matches: TournamentCSGOMatch [] = [
      {
        id: 'm1', team1: alpha, team2: bravo, team1Id: 'team-1', team2Id: 'team-2', winnerTeamId: 'team-1',
        startTime: new Date(2024, 0, 15, 18, 30), videoLink: 'https://video/1', demoLink: 'https://demo/1',
        maps: [
          { id: 'map1', map: CSGOMap.Mirage, team1Score: 13, team2Score: 7 },
          { id: 'map2', map: CSGOMap.Inferno, team1Score: 13, team2Score: 11 }
        ]
      },
      {
        id: 'm2', team1: alpha, team2: bravo, team1Id: 'team-1', team2Id: 'team-2', winnerTeamId: 'team-2',
        noShow: true, maps: []
      },
      { id: 'm3', team1: bravo, team2: alpha, team1Id: 'team-2', team2Id: 'team-1', maps: [] }
    ];
    flushUser(null);
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    flushPage('', { matches });
    await render();

    expect(component.csgomatches()).toEqual(matches);
    const schedule = grids()[0];
    const rows = Array.from(schedule.querySelectorAll('igx-grid-row'));
    expect(rows.length).toBe(3);

    const teamLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.grid-team-name'));
    expect(teamLinks(rows[0]).map(a => a.classList.contains('color-success'))).toEqual([true, false]);
    expect(teamLinks(rows[1]).map(a => a.classList.contains('color-success'))).toEqual([false, true]);
    expect(teamLinks(rows[2]).map(a => a.classList.contains('color-success'))).toEqual([false, false]);
    expect(teamLinks(rows[0])[0].getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-1-url`);
    expect(teamLinks(rows[0])[1].textContent.trim()).toBe('Bravo');

    // Video and demo cells only show a link when the match has one
    const mediaLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.horizontal-center'))
      .map(a => a.getAttribute('href'));
    expect(mediaLinks(rows[0])).toEqual(['https://video/1', 'https://demo/1']);
    expect(mediaLinks(rows[1])).toEqual([]);
    expect(rows[0].textContent).toContain('Jan 15, 2024, 6:30 PM');

    const grid = fixture.debugElement.query(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
      .componentInstance as IgxGridComponent;
    grid.expandAll();
    await render();

    const details = Array.from(schedule.querySelectorAll('[igxgriddetail], .igx-grid__tr-container'));
    const detailText = details.map(d => d.textContent.replace(/\s+/g, ' ').trim());
    expect(detailText.some(t => t.includes('13') && t.includes('7'))).toBe(true);
    expect(detailText.some(t => t.includes('Walkover'))).toBe(true);
    expect(detailText.some(t => t.includes('The match has not been played yet'))).toBe(true);
    // A walkover is never reported as an unplayed match
    expect(detailText.filter(t => t.includes('The match has not been played yet')).length).toBe(1);

    const mapAvatar = schedule.querySelector<HTMLElement>('.score-container + igx-avatar');
    expect(mapAvatar.getAttribute('title')).toBe('Mirage');
  });

  it('renders a standings grid per group with colour-coded round difference', async () => {
    const participant = (id: string, t: CSGOTeam, roundDifference: number): TournamentParticipant => ({
      ...makeRegistration(id, `u-${id}`, TournamentApplicationState.Confirmed, t),
      roundDifference
    });
    const groups: TournamentCSGOGroup [] = [
      {
        id: 'g1', name: 'Group A', participants: [
          participant('p1', team('team-1', 'Alpha'), 12),
          participant('p2', team('team-2', 'Bravo'), -12),
          participant('p3', team('team-3', 'Charlie'), 0)
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
    expect(groupGrids.map(g => g.querySelector('igx-grid-toolbar-title').textContent.trim())).toEqual(['Group A', 'Group B']);

    const teamLinks = Array.from(groupGrids[0].querySelectorAll<HTMLAnchorElement>('a[igxListLineTitle]'));
    expect(teamLinks.map(a => a.textContent.trim())).toEqual(['Alpha', 'Bravo', 'Charlie']);
    expect(teamLinks[1].getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-2-url`);

    const rows = Array.from(groupGrids[0].querySelectorAll('igx-grid-row'));
    const diffClass = (row: Element) => {
      const span = Array.from(row.querySelectorAll('span')).find(s => /^-?\d+$/.test(s.textContent.trim()));
      return span.className;
    };
    expect(rows.map(diffClass)).toEqual(['color-success', 'color-error', '']);
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

  it('hides the team brackets for registrations without a team', async () => {
    flushUser(null);
    httpMock.expectOne(activeTournamentUrl()).flush(null);
    flushPage('', {
      registrations: [
        makeRegistration('r1', 'u1', TournamentApplicationState.Confirmed, team('team-1', 'Alpha')),
        { ...makeRegistration('r2', 'u2', TournamentApplicationState.Confirmed, team('team-2', 'Bravo')), companyId: null }
      ]
    });
    await render();

    const slots = Array.from(el().querySelectorAll('.registration-slot'));
    expect(slots.map(s => s.querySelector(':scope > span')?.textContent ?? null)).toEqual(['[Alpha Inc.]', null]);
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
      fixture = TestBed.createComponent(TournamentCsgoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('moves the media links from their columns to the match details and shortens the start time', async () => {
      const matches: TournamentCSGOMatch [] = [{
        id: 'm1', team1: team('team-1', 'Alpha'), team2: team('team-2', 'Bravo'), team1Id: 'team-1', team2Id: 'team-2',
        startTime: new Date(2024, 0, 15, 18, 30), videoLink: 'https://video/1', demoLink: 'https://demo/1', maps: []
      }];
      httpMock.match(req => req.url.includes('csgomatches')).forEach(req => req.flush(matches));
      httpMock.match(() => true).forEach(req => req.flush(null));
      await render();

      expect(component.narrowScreen()).toBe(true);
      const grid = fixture.debugElement.queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
        .map(debugEl => debugEl.componentInstance as IgxGridComponent)
        .find(g => g.data === component.csgomatches());
      expect(grid.getColumnByName('videoLink').hidden).toBe(true);
      expect(grid.getColumnByName('demoLink').hidden).toBe(true);
      expect(grid.getColumnByName('startTime').width).toBe('150px');

      const schedule = grids()[0];
      const row = schedule.querySelector('igx-grid-row');
      expect(row.textContent).toMatch(/1\/15\/24, 6:30\sPM/);
      expect(row.querySelectorAll('a.horizontal-center').length).toBe(0);

      grid.expandAll();
      await render();
      const links = Array.from(schedule.querySelectorAll<HTMLAnchorElement>('.match-links a'));
      expect(links.map(a => [a.getAttribute('href'), a.querySelector('span').textContent.trim()])).toEqual([
        ['https://video/1', 'Video'],
        ['https://demo/1', 'Demo']
      ]);
    });

    it('shows only the media links a match has in its details', async () => {
      const match = (id: string, links: Partial<TournamentCSGOMatch>): TournamentCSGOMatch => ({
        id, team1: team('team-1', 'Alpha'), team2: team('team-2', 'Bravo'), team1Id: 'team-1', team2Id: 'team-2',
        startTime: new Date(2024, 0, 15, 18, 30), maps: [], ...links
      });
      const matches = [match('m1', { videoLink: 'https://video/1' }), match('m2', { demoLink: 'https://demo/2' }), match('m3', {})];
      httpMock.match(req => req.url.includes('csgomatches')).forEach(req => req.flush(matches));
      httpMock.match(() => true).forEach(req => req.flush(null));
      await render();

      const grid = fixture.debugElement.queryAll(debugEl => debugEl.componentInstance instanceof IgxGridComponent)
        .map(debugEl => debugEl.componentInstance as IgxGridComponent)
        .find(g => g.data === component.csgomatches());
      grid.expandAll();
      await render();

      // The match without links gets no links area at all
      const linkAreas = Array.from(grids()[0].querySelectorAll('.match-links'))
        .map(area => Array.from(area.querySelectorAll('a')).map(a => [a.getAttribute('href'), a.querySelector('span').textContent.trim()]));
      expect(linkAreas).toEqual([
        [['https://video/1', 'Video']],
        [['https://demo/2', 'Demo']]
      ]);
    });
  });
});
