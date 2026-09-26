import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BehaviorSubject, of } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';
import { Params } from '@angular/router';

import { TournamentDetailComponent } from './tournament-detail.component';
import { Tournament, TournamentParticipant, TournamentStatus, TournamentVisibility, Game } from '../../../models/tournament';
import { SC2Race, TournamentCSGOMatch, TournamentSC2Match } from '../../../models/tournament-schedule';
import { ApplicationUser } from '../../../models/applicationuser';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../services/login.service';
import { createSpyObj, SpyObj } from '../../../../../testing/spy-obj';

describe('TournamentDetailComponent', () => {
  let component: TournamentDetailComponent;
  let fixture: ComponentFixture<TournamentDetailComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({ tournamentId: 't1' }) }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading true', () => {
    expect(component.loading()).toBe(true);
  });

  it('should start with no tournament', () => {
    expect(component.tournament()).toBeNull();
  });

  it('should load tournament from route params', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Test Tournament',
      status: TournamentStatus.Open,
      visibility: TournamentVisibility.Public,
      game: Game.CSGO
    });

    expect(component.tournament()).toBeTruthy();
    expect(component.tournament()!.name).toBe('Test Tournament');
    expect(component.loading()).toBe(false);
  });

  it('should return correct status label', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({ id: 't1', name: 'Test', status: TournamentStatus.InProgress });

    expect(component.statusLabel()).toBe('In Progress');
  });

  it('should return correct visibility icon', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({ id: 't1', name: 'Test', visibility: TournamentVisibility.Private });

    expect(component.visibilityIcon()).toBe('lock');
  });

  it('should return empty status label when no tournament', () => {
    expect(component.statusLabel()).toBe('');
  });

  it('should return public visibility icon when no tournament', () => {
    expect(component.visibilityIcon()).toBe('public');
  });

  it('should compute canJoin for open public tournament', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Test',
      status: TournamentStatus.Open,
      visibility: TournamentVisibility.Public
    });

    expect(component.canJoin()).toBeTruthy();
  });

  it('should not allow join for private tournament', () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Test',
      status: TournamentStatus.Open,
      visibility: TournamentVisibility.Private
    });

    expect(component.canJoin()).toBeFalsy();
  });
});

describe('TournamentDetailComponent (no route param)', () => {
  let component: TournamentDetailComponent;
  let fixture: ComponentFixture<TournamentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not load tournament when no tournamentId param', () => {
    expect(component.tournament()).toBeNull();
    expect(component.loading()).toBe(true);
  });
});

describe('TournamentDetailComponent (rendering)', () => {
  let fixture: ComponentFixture<TournamentDetailComponent>;
  let component: TournamentDetailComponent;
  let params$: BehaviorSubject<Params>;
  let apiService: SpyObj<ApiTournamentsService>;
  let authUser: WritableSignal<ApplicationUser>;
  let loadingSC2Registrations: WritableSignal<boolean>;
  let tournaments: Map<string, WritableSignal<Tournament>>;
  let sc2Registrations: Map<string, WritableSignal<TournamentParticipant []>>;
  let sc2Matches: Map<string, WritableSignal<TournamentSC2Match []>>;
  let csgoMatches: Map<string, WritableSignal<TournamentCSGOMatch []>>;

  const appUser = (id: string, username: string, overrides: Partial<ApplicationUser> = {}): ApplicationUser =>
    ({ id, username, ...overrides } as ApplicationUser);

  const participant = (id: string, overrides: Partial<TournamentParticipant> = {}): TournamentParticipant =>
    ({ id, userId: `u-${id}`, state: 0, companyId: null, ...overrides } as TournamentParticipant);

  // Per-id cache signals, created on first read the way the real service does
  const entry = <T>(cache: Map<string, WritableSignal<T>>, id: string): WritableSignal<T> => {
    if (!cache.has(id)) {
      cache.set(id, signal<T>(null));
    }
    return cache.get(id);
  };

  const el = (): HTMLElement => fixture.nativeElement;
  const text = (): string => el().textContent.replace(/\s+/g, ' ');
  const q = (selector: string): HTMLElement => el().querySelector(selector);
  const qa = (selector: string): HTMLElement [] => Array.from(el().querySelectorAll<HTMLElement>(selector));
  const chips = (): string [] => qa('.hero-badges igx-chip').map(c => c.textContent.replace(/\s+/g, ' ').trim());

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  // igx-tabs selects its first tab in a microtask without marking the view for check, so the
  // panels only render on the next change detection. Open the tab the way a user would.
  const openTab = async (label: string) => {
    const header = qa('igx-tab-header').find(h => h.textContent.includes(label));
    header.click();
    await render();
  };

  const create = async (tournament?: Tournament) => {
    if (tournament) {
      entry(tournaments, tournament.id).set(tournament);
    }
    fixture = TestBed.createComponent(TournamentDetailComponent);
    component = fixture.componentInstance;
    await render();
  };

  const baseTournament = (overrides: Partial<Tournament> = {}): Tournament => ({
    id: 't1',
    name: 'Winter Cup',
    game: Game.StarCraft2,
    status: TournamentStatus.Open,
    visibility: TournamentVisibility.Public,
    creatorId: 'owner',
    ...overrides
  });

  beforeEach(async () => {
    params$ = new BehaviorSubject<Params>({ tournamentId: 't1' });
    authUser = signal<ApplicationUser>(null);
    loadingSC2Registrations = signal(false);
    tournaments = new Map();
    sc2Registrations = new Map();
    sc2Matches = new Map();
    csgoMatches = new Map();

    apiService = createSpyObj<ApiTournamentsService>('ApiTournamentsService',
      ['getTournament', 'getSc2Registrations', 'getSc2Matches', 'getCsgoMatches'],
      { loadingSC2Registrations: loadingSC2Registrations.asReadonly() });
    apiService.getTournament.mockImplementation((id: string) => entry(tournaments, id).asReadonly());
    apiService.getSc2Registrations.mockImplementation((id: string) => entry(sc2Registrations, id).asReadonly());
    apiService.getSc2Matches.mockImplementation((id: string) => entry(sc2Matches, id).asReadonly());
    apiService.getCsgoMatches.mockImplementation((id: string) => entry(csgoMatches, id).asReadonly());

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TournamentDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: params$ } },
        { provide: ApiTournamentsService, useValue: apiService },
        { provide: LoginService, useValue: { applicationUser: authUser.asReadonly() } }
      ]
    }).compileComponents();
  });

  describe('loading', () => {
    it('shows only the spinner and fetches no game data while the tournament is loading', async () => {
      await create();

      expect(apiService.getTournament).toHaveBeenCalledWith('t1');
      expect(q('.loading-container igx-circular-bar')).toBeTruthy();
      expect(q('.detail-container')).toBeNull();
      expect(apiService.getSc2Registrations).not.toHaveBeenCalled();
      expect(apiService.getSc2Matches).not.toHaveBeenCalled();
      expect(apiService.getCsgoMatches).not.toHaveBeenCalled();
    });

    it('renders the tournament once the service responds', async () => {
      await create();
      tournaments.get('t1').set(baseTournament());
      await render();

      expect(component.loading()).toBe(false);
      expect(q('.detail-container')).toBeTruthy();
      expect(q('h1').textContent).toContain('Winter Cup');
      expect(qa(':scope > .loading-container').length).toBe(0);
    });

    it('does not fetch anything when the route has no tournament id', async () => {
      params$.next({});
      await create();

      expect(apiService.getTournament).not.toHaveBeenCalled();
      expect(apiService.getSc2Registrations).not.toHaveBeenCalled();
      expect(apiService.getSc2Matches).not.toHaveBeenCalled();
      expect(apiService.getCsgoMatches).not.toHaveBeenCalled();
      expect(q('.detail-container')).toBeNull();
    });

    it('does not render details or fetch game data for an unknown tournament', async () => {
      params$.next({ tournamentId: 'missing' });
      await create();

      expect(apiService.getTournament).toHaveBeenCalledWith('missing');
      expect(component.tournament()).toBeNull();
      expect(q('.detail-container')).toBeNull();
      expect(apiService.getSc2Registrations).not.toHaveBeenCalled();
      expect(apiService.getCsgoMatches).not.toHaveBeenCalled();
    });
  });

  describe('hero', () => {
    it('renders the name, dates, prize pool, description, logo and max players', async () => {
      await create(baseTournament({
        description: 'The coldest cup',
        prizePool: '$1000',
        startDate: new Date(2026, 0, 10),
        endDate: new Date(2026, 0, 12),
        logo: 'https://cdn/logo.png',
        maxParticipants: 64
      }));

      expect(q('h1').textContent.trim()).toBe('Winter Cup');
      expect(q('.hero-description').textContent).toContain('The coldest cup');
      expect(q('.hero-prize').textContent).toContain('$1000');
      expect(q('.hero-date').textContent).toContain('January 10, 2026');
      expect(q('.hero-date').textContent).toContain('January 12, 2026');
      expect(q('.hero-bg').style.backgroundImage).toContain('https://cdn/logo.png');
      expect(q('.stats-strip .stat-value').textContent.trim()).toBe('64');
    });

    it('omits optional sections the tournament does not have', async () => {
      await create(baseTournament());

      expect(q('.hero-description')).toBeNull();
      expect(q('.hero-prize')).toBeNull();
      expect(q('.hero-date')).toBeNull();
      expect(q('.hero-bg')).toBeNull();
      expect(q('.stats-strip')).toBeNull();
    });

    it('shows the start date without an end date', async () => {
      await create(baseTournament({ startDate: new Date(2026, 4, 1) }));

      expect(q('.hero-date').textContent).toContain('May 1, 2026');
      expect(q('.hero-date').textContent).not.toContain('–');
    });

    it.each([
      [TournamentStatus.Draft, 'Draft', 'status-draft'],
      [TournamentStatus.Open, 'Open', 'status-open'],
      [TournamentStatus.InProgress, 'In Progress', 'status-in-progress'],
      [TournamentStatus.Completed, 'Completed', 'status-completed'],
      [TournamentStatus.Cancelled, 'Cancelled', 'status-cancelled']
    ])('labels a %s tournament "%s"', async (status, label, cssClass) => {
      await create(baseTournament({ status }));

      expect(component.statusLabel()).toBe(label);
      const statusChip = q('.hero-badges igx-chip');
      expect(statusChip.textContent.trim()).toBe(label);
      expect(statusChip.classList).toContain(cssClass);
    });

    it('shows an empty status label for an unknown status', async () => {
      await create(baseTournament({ status: 'archived' as TournamentStatus }));

      expect(component.statusLabel()).toBe('');
      expect(chips()[0]).toBe('');
    });

    it.each([
      [TournamentVisibility.Public, 'public', 'public'],
      [TournamentVisibility.Private, 'lock', 'private'],
      [TournamentVisibility.InviteOnly, 'mail', 'invite-only'],
      [undefined, 'public', 'public'],
      ['unlisted' as TournamentVisibility, 'public', 'unlisted']
    ])('shows visibility %s with the "%s" icon', async (visibility, icon, label) => {
      await create(baseTournament({ visibility }));

      expect(component.visibilityIcon()).toBe(icon);
      expect(q('.hero-badges igx-chip:nth-of-type(2) igx-icon').textContent.trim()).toBe(icon);
      expect(chips()[1]).toBe(`${icon} ${label}`);
    });
  });

  describe('register button', () => {
    const registerButton = () => qa('.hero-actions button').find(b => b.textContent.includes('Register'));

    it.each([
      [TournamentStatus.Open, TournamentVisibility.Public, true],
      [TournamentStatus.Open, TournamentVisibility.InviteOnly, true],
      [TournamentStatus.Open, TournamentVisibility.Private, false],
      [TournamentStatus.Draft, TournamentVisibility.Public, false],
      [TournamentStatus.InProgress, TournamentVisibility.Public, false],
      [TournamentStatus.Completed, TournamentVisibility.Public, false]
    ])('for a %s %s tournament is shown: %s', async (status, visibility, shown) => {
      await create(baseTournament({ status, visibility }));

      expect(!!registerButton()).toBe(shown);
    });
  });

  describe('owner actions', () => {
    const manageLink = (): HTMLAnchorElement =>
      qa('.hero-actions a').find(a => a.textContent.includes('Manage')) as HTMLAnchorElement;

    it('shows the manage link and invite code to the owner', async () => {
      authUser.set(appUser('owner', 'Boss'));
      await create(baseTournament({ inviteCode: 'SECRET-42' }));

      expect(component.isOwner()).toBe(true);
      expect(manageLink()).toBeTruthy();
      expect(manageLink().getAttribute('href')).toBe('/tournaments/manage/t1');
      expect(q('.invite-code-box code').textContent.trim()).toBe('SECRET-42');
    });

    it('shows the manage link but no invite box to an owner of a tournament without an invite code', async () => {
      authUser.set(appUser('owner', 'Boss'));
      await create(baseTournament());

      expect(manageLink()).toBeTruthy();
      expect(q('.invite-code-box')).toBeNull();
    });

    it('hides owner actions from other users', async () => {
      authUser.set(appUser('someone-else', 'Guest'));
      await create(baseTournament({ inviteCode: 'SECRET-42' }));

      expect(component.isOwner()).toBeFalsy();
      expect(manageLink()).toBeUndefined();
      expect(q('.invite-code-box')).toBeNull();
      expect(text()).not.toContain('SECRET-42');
    });

    it('hides owner actions when logged out', async () => {
      await create(baseTournament({ inviteCode: 'SECRET-42' }));

      expect(component.isOwner()).toBeFalsy();
      expect(manageLink()).toBeUndefined();
      expect(q('.invite-code-box')).toBeNull();
    });

    it('reveals owner actions when the owner logs in, and hides them on logout', async () => {
      await create(baseTournament({ inviteCode: 'SECRET-42' }));
      expect(manageLink()).toBeUndefined();

      authUser.set(appUser('owner', 'Boss'));
      await render();
      expect(manageLink()).toBeTruthy();
      expect(q('.invite-code-box')).toBeTruthy();

      authUser.set(null);
      await render();
      expect(manageLink()).toBeUndefined();
      expect(q('.invite-code-box')).toBeNull();
    });
  });

  describe('game data', () => {
    it('loads only StarCraft II registrations and matches for an SC2 tournament', async () => {
      await create(baseTournament({ game: Game.StarCraft2 }));

      expect(apiService.getSc2Registrations).toHaveBeenCalledWith('t1');
      expect(apiService.getSc2Matches).toHaveBeenCalledWith('t1');
      expect(component.csgoMatches()).toBeNull();
      expect(apiService.getCsgoMatches).not.toHaveBeenCalled();
    });

    it('loads only CS:GO matches for a CS:GO tournament', async () => {
      await create(baseTournament({ game: Game.CSGO }));
      component.csgoMatches();

      expect(apiService.getCsgoMatches).toHaveBeenCalledWith('t1');
      expect(apiService.getSc2Registrations).not.toHaveBeenCalled();
      expect(apiService.getSc2Matches).not.toHaveBeenCalled();
      expect(component.registrations()).toEqual([]);
      expect(component.sc2Matches()).toBeNull();
    });

    it('loads both games\' data for a tournament without a game', async () => {
      await create(baseTournament({ game: undefined }));
      component.csgoMatches();

      expect(apiService.getSc2Registrations).toHaveBeenCalledWith('t1');
      expect(apiService.getSc2Matches).toHaveBeenCalledWith('t1');
      expect(apiService.getCsgoMatches).toHaveBeenCalledWith('t1');
    });

    it('exposes the CS:GO matches from the service', async () => {
      const matches: TournamentCSGOMatch [] = [{ id: 'cm1', team1Points: 16, team2Points: 10 }];
      entry(csgoMatches, 't1').set(matches);
      await create(baseTournament({ game: Game.CSGO }));

      expect(component.csgoMatches()).toEqual(matches);
    });
  });

  describe('participants', () => {
    it('lists StarCraft II registrations with name, country and organisation', async () => {
      entry(sc2Registrations, 't1').set([
        participant('r1', { user: appUser('u1', 'Serral'), country: 'Finland', companyId: 'ENCE' }),
        participant('r2', { battleTag: 'Clem#1234' })
      ]);
      await create(baseTournament());
      await openTab('Participants');

      const cards = qa('.participants-grid .participant-card');
      expect(cards.length).toBe(2);
      expect(cards[0].querySelector('.participant-name').textContent.trim()).toBe('Serral');
      expect(cards[0].querySelector('.participant-org').textContent.trim()).toBe('[ENCE]');
      expect(cards[0].querySelector('.country-badge')).toBeTruthy();
      expect(cards[0].querySelector('.country-badge').getAttribute('title')).toBe('Finland');
      expect(cards[1].querySelector('.participant-name').textContent.trim()).toBe('Clem#1234');
      expect(cards[1].querySelector('.participant-org')).toBeNull();
      expect(cards[1].querySelector('.country-badge')).toBeNull();
      expect(text()).not.toContain('No participants registered yet');
    });

    it('shows the empty state when nobody has registered', async () => {
      entry(sc2Registrations, 't1').set([]);
      await create(baseTournament());
      await openTab('Participants');

      expect(qa('.participant-card').length).toBe(0);
      expect(q('.participants-grid .empty-state').textContent).toContain('No participants registered yet');
    });

    it('shows the empty state for a CS:GO tournament', async () => {
      await create(baseTournament({ game: Game.CSGO }));
      await openTab('Participants');

      expect(q('.participants-grid .empty-state').textContent).toContain('No participants registered yet');
    });

    it('shows a spinner in place of the list while registrations load', async () => {
      loadingSC2Registrations.set(true);
      await create(baseTournament());
      await openTab('Participants');

      expect(q('.detail-container igx-tab-content .loading-container igx-circular-bar')).toBeTruthy();
      expect(q('.participants-grid')).toBeNull();

      entry(sc2Registrations, 't1').set([participant('r1', { user: appUser('u1', 'Maru') })]);
      loadingSC2Registrations.set(false);
      await render();

      expect(q('.detail-container igx-tab-content .loading-container')).toBeNull();
      expect(q('.participant-name').textContent.trim()).toBe('Maru');
    });
  });

  describe('matches', () => {
    it('renders SC2 matches with players, score, winner, races and video link', async () => {
      entry(sc2Matches, 't1').set([
        {
          id: 'm1',
          startTime: new Date(2026, 2, 3, 18, 30),
          player1: appUser('p1', 'Serral'),
          player2: appUser('p2', 'Maru'),
          player1Points: 3,
          player2Points: 1,
          player1Race: SC2Race.Zerg,
          player2Race: SC2Race.Terran,
          videoLink: 'https://twitch.tv/vod/1'
        },
        { id: 'm2', player1: appUser('p3', 'Clem'), player2: appUser('p4', 'Reynor'), player1Points: 0, player2Points: 2 }
      ]);
      await create(baseTournament());
      await openTab('Matches');

      const rows = qa('.matches-section .match-row');
      expect(rows.length).toBe(2);

      const [first, second] = rows;
      expect(first.querySelector('.match-time').textContent).toContain('Mar 3, 6:30 PM');
      const firstPlayers = first.querySelectorAll('.match-players > .player');
      expect(firstPlayers[0].textContent).toContain('Serral');
      expect(firstPlayers[0].classList).toContain('winner');
      expect(firstPlayers[1].textContent).toContain('Maru');
      expect(firstPlayers[1].classList).not.toContain('winner');
      expect(first.querySelector('.match-score').textContent.replace(/\s+/g, '')).toBe('3:1');
      expect(first.querySelectorAll('.race-icon').length).toBe(2);
      expect(first.querySelector('.match-actions a').getAttribute('href')).toBe('https://twitch.tv/vod/1');

      const secondPlayers = second.querySelectorAll('.match-players > .player');
      expect(secondPlayers[0].classList).not.toContain('winner');
      expect(secondPlayers[1].classList).toContain('winner');
      expect(second.querySelectorAll('.race-icon').length).toBe(0);
      expect(second.querySelector('.match-actions a')).toBeNull();
      expect(text()).not.toContain('No matches scheduled yet');
    });

    it('shows the empty state for an SC2 tournament without matches', async () => {
      entry(sc2Matches, 't1').set([]);
      await create(baseTournament());
      await openTab('Matches');

      expect(qa('.match-row').length).toBe(0);
      expect(q('.matches-section .empty-state').textContent).toContain('No matches scheduled yet');
    });

    it('renders nothing in the matches section until SC2 matches load', async () => {
      await create(baseTournament());
      await openTab('Matches');

      expect(q('.matches-section')).toBeTruthy();
      expect(q('.matches-section').children.length).toBe(0);
    });

    it('renders no SC2 match section for a CS:GO tournament', async () => {
      entry(csgoMatches, 't1').set([{ id: 'cm1' }]);
      await create(baseTournament({ game: Game.CSGO }));
      await openTab('Matches');

      expect(qa('.match-row').length).toBe(0);
      expect(q('.matches-section .empty-state')).toBeNull();
    });
  });

  describe('route changes', () => {
    it('switches to the new tournament and its data when the route id changes', async () => {
      entry(sc2Registrations, 't1').set([participant('r1', { user: appUser('u1', 'Serral') })]);
      entry(sc2Registrations, 't2').set([participant('r2', { user: appUser('u2', 'Clem') })]);
      entry(tournaments, 't2').set(baseTournament({ id: 't2', name: 'Spring Cup', status: TournamentStatus.Completed }));
      await create(baseTournament());

      await openTab('Participants');
      expect(q('h1').textContent).toContain('Winter Cup');
      expect(q('.participant-name').textContent.trim()).toBe('Serral');

      params$.next({ tournamentId: 't2' });
      await render();

      expect(apiService.getTournament).toHaveBeenCalledWith('t2');
      expect(apiService.getSc2Registrations).toHaveBeenCalledWith('t2');
      expect(apiService.getSc2Matches).toHaveBeenCalledWith('t2');
      expect(q('h1').textContent).toContain('Spring Cup');
      expect(chips()[0]).toBe('Completed');
      expect(qa('.participant-name').map(n => n.textContent.trim())).toEqual(['Clem']);
    });

    it('shows the spinner while a newly routed tournament loads', async () => {
      await create(baseTournament());
      params$.next({ tournamentId: 't3' });
      await render();

      expect(q('.detail-container')).toBeNull();
      expect(q('.loading-container igx-circular-bar')).toBeTruthy();
    });
  });
});
