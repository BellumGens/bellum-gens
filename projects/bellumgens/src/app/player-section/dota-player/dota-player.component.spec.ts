import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { of, Subject, throwError } from 'rxjs';

import { DotaPlayerComponent } from './dota-player.component';
import { ApplicationUser, Dota2Profile, Dota2RecentMatch } from 'bellum-gens-common/models';
import { BellumgensApiService } from 'bellum-gens-common/services';

const STEAM_ID = '76561198012345678';

const makePlayer = (overrides: Partial<ApplicationUser> = {}, steamId = STEAM_ID): ApplicationUser => ({
  id: 'player-1',
  steamId,
  username: 'Miracle',
  battleNetId: null,
  email: '',
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  steamUser: {
    steamID64: steamId,
    steamID: 'Miracle-',
    realname: 'Amer',
    avatarFull: 'https://avatars.steamstatic.com/full.jpg',
    customURL: 'miracle'
  } as ApplicationUser['steamUser'],
  ...overrides
});

const makeMatch = (overrides: Partial<Dota2RecentMatch> = {}): Dota2RecentMatch => ({
  matchId: 102,
  startTime: '2023-11-15T01:46:40+00:00',
  duration: 1800,
  gameMode: 22,
  lobbyType: 7,
  won: false,
  heroId: 2,
  heroName: 'Axe',
  heroImageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png',
  kills: 4,
  deaths: 6,
  assists: 8,
  lastHits: 100,
  denies: 4,
  goldPerMinute: 400,
  experiencePerMinute: 500,
  level: 18,
  abandoned: false,
  ...overrides
});

const makeProfile = (overrides: Partial<Dota2Profile> = {}): Dota2Profile => ({
  steamId: STEAM_ID,
  accountId: 52079950,
  matchHistoryPrivate: false,
  matches: 2,
  wins: 1,
  losses: 1,
  abandons: 0,
  winRate: 50,
  kda: 3.5,
  killDeathRatio: 1.75,
  averageKills: 7,
  averageDeaths: 4,
  averageAssists: 7,
  averageLastHits: 200,
  averageGoldPerMinute: 550,
  averageExperiencePerMinute: 650,
  heroes: [
    { heroId: 1, heroName: 'Anti-Mage', heroImageUrl: null, matches: 1, wins: 1, losses: 0, winRate: 100 },
    { heroId: 2, heroName: null, heroImageUrl: null, matches: 3, wins: 0, losses: 3, winRate: 0 }
  ],
  recentMatches: [
    makeMatch(),
    makeMatch({ matchId: 101, won: true, heroId: 1, heroName: 'Anti-Mage', kills: 10, deaths: 2, assists: 6, duration: 3729, abandoned: true })
  ],
  ...overrides
});

describe('DotaPlayerComponent', () => {
  let component: DotaPlayerComponent;
  let fixture: ComponentFixture<DotaPlayerComponent>;
  let player: WritableSignal<ApplicationUser | null>;
  let apiService: BellumgensApiService;
  let title: Title;

  beforeEach(async () => {
    player = signal<ApplicationUser | null>(null);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        DotaPlayerComponent
      ],
      providers: [
        { provide: ROUTER_OUTLET_DATA, useValue: player },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    apiService = TestBed.inject(BellumgensApiService);
    title = TestBed.inject(Title);
  });

  const create = () => {
    fixture = TestBed.createComponent(DotaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const render = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;
  const text = (selector: string) => el().querySelector(selector)?.textContent?.trim();

  it('shows a not found message and loads nothing without a Steam account', () => {
    const spy = vi.spyOn(apiService, 'getDota2Profile');
    player.set(makePlayer({ steamUser: undefined, steamUserException: true }));
    create();

    expect(text('.loading-overview h4')).toBe('Steam Dota 2 player profile not found...');
    expect(el().querySelector('.profile-view-layout')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows the loading indicator while the player is loading', () => {
    apiService['_loadingPlayer'].set(true);
    create();

    expect(el().querySelector('bg-loading')).not.toBeNull();
  });

  it('shows the loading indicator until the Dota 2 profile arrives', () => {
    const response = new Subject<Dota2Profile>();
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(response);
    player.set(makePlayer());
    create();

    expect(el().querySelector('bg-loading')).not.toBeNull();

    response.next(makeProfile());
    fixture.detectChanges();
    expect(el().querySelector('bg-loading')).toBeNull();
  });

  it('renders the Steam name, profile link and real name of the player', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile()));
    player.set(makePlayer());
    create();

    const link = el().querySelector<HTMLAnchorElement>('h1 a')!;
    expect(link.textContent.trim()).toBe('Miracle-');
    expect(link.getAttribute('href')).toBe('https://steamcommunity.com/id/miracle');
    expect(text('.profile-container h4')).toBe('Amer');
  });

  it('loads the profile by the steam id and sets the page title', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile()));
    player.set(makePlayer());
    create();

    expect(apiService.getDota2Profile).toHaveBeenCalledExactlyOnceWith(STEAM_ID);
    expect(component.profile()).toEqual(makeProfile());
    expect(title.getTitle()).toBe('Dota 2 Player: Miracle-');
  });

  it('loads the profile only once per Steam account', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile()));
    player.set(makePlayer());
    create();

    // the parent hands down a new object for the same player (e.g. after a refresh)
    player.set(makePlayer({ username: 'Miracle (updated)' }));
    fixture.detectChanges();
    expect(apiService.getDota2Profile).toHaveBeenCalledTimes(1);

    player.set(makePlayer({ id: 'player-2' }, '76561198000000002'));
    fixture.detectChanges();
    expect(apiService.getDota2Profile).toHaveBeenCalledTimes(2);
    expect(apiService.getDota2Profile).toHaveBeenLastCalledWith('76561198000000002');
  });

  it('clears the previous profile and ignores a stale response after switching player', () => {
    const first = new Subject<Dota2Profile>();
    const second = new Subject<Dota2Profile>();
    vi.spyOn(apiService, 'getDota2Profile')
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);

    player.set(makePlayer());
    create();

    player.set(makePlayer({ id: 'player-2' }, '76561198000000002'));
    fixture.detectChanges();
    expect(component.profile()).toBeNull();

    // the response for the previous player arrives late and must not be shown
    first.next(makeProfile());
    expect(component.profile()).toBeNull();

    const fresh = makeProfile({ steamId: '76561198000000002', matches: 7 });
    second.next(fresh);
    expect(component.profile()).toEqual(fresh);
  });

  it('loads the stats again when coming back from a player without a Steam account before they arrived', () => {
    const first = new Subject<Dota2Profile>();
    const again = new Subject<Dota2Profile>();
    vi.spyOn(apiService, 'getDota2Profile')
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(again);

    player.set(makePlayer());
    create();

    // another player without a Steam account is shown before the stats arrive
    player.set(makePlayer({ id: 'player-2', steamUser: undefined, steamUserException: true }));
    fixture.detectChanges();
    expect(first.observed).toBe(false);
    expect(el().querySelector('bg-loading')).toBeNull();

    player.set(makePlayer());
    fixture.detectChanges();
    expect(apiService.getDota2Profile).toHaveBeenCalledTimes(2);
    expect(el().querySelector('bg-loading')).not.toBeNull();

    again.next(makeProfile());
    fixture.detectChanges();
    expect(component.profile()).toEqual(makeProfile());
    expect(el().querySelector('bg-loading')).toBeNull();
  });

  it('tries again after a failed load when the player is shown again', () => {
    vi.spyOn(apiService, 'getDota2Profile')
      .mockReturnValueOnce(throwError(() => new Error('502')))
      .mockReturnValueOnce(of(makeProfile()));
    player.set(makePlayer());
    create();
    expect(component.profileError()).toBe(true);

    player.set(makePlayer({ username: 'Miracle (updated)' }));
    fixture.detectChanges();

    expect(apiService.getDota2Profile).toHaveBeenCalledTimes(2);
    expect(component.profileError()).toBe(false);
    expect(component.profile()).toEqual(makeProfile());
  });

  it('cancels a running request when the component is destroyed', () => {
    const response = new Subject<Dota2Profile>();
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(response);
    player.set(makePlayer());
    create();
    expect(response.observed).toBe(true);

    fixture.destroy();

    expect(response.observed).toBe(false);
  });

  it('shows an error when Steam could not be reached', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(throwError(() => new Error('502')));
    player.set(makePlayer());
    create();

    expect(text('.dota-message h4')).toBe('Dota 2 stats could not be loaded from Steam.');
    expect(el().querySelector('bg-loading')).toBeNull();
    expect(el().querySelector('igx-grid')).toBeNull();
  });

  it('explains how to expose the match data when it is private', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile({
      matchHistoryPrivate: true, matches: 0, wins: 0, losses: 0, heroes: [], recentMatches: []
    })));
    player.set(makePlayer());
    create();

    expect(text('.dota-message h4')).toBe('Dota 2 match data is private.');
    expect(el().querySelector('.dota-message .highlight')!.textContent).toContain('Expose Public Match Data');
    expect(el().querySelector('igx-card')).toBeNull();
  });

  it('shows a message when there are no recent matches', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile({
      matches: 0, wins: 0, losses: 0, heroes: [], recentMatches: []
    })));
    player.set(makePlayer());
    create();

    expect(text('.dota-message h4')).toBe('No recent Dota 2 matches found.');
    expect(el().querySelector('igx-grid')).toBeNull();
  });

  it('renders the summary of the recent matches', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile({ abandons: 1 })));
    player.set(makePlayer());
    create();

    const titles = Array.from(el().querySelectorAll('igx-card [igxCardHeaderTitle]')).map(t => t.textContent.trim());
    expect(titles).toEqual(['Win rate', 'KDA', 'Last 2 matches', 'Most played heroes']);

    const summary = Array.from(el().querySelectorAll('.dota-summary > div'))
      .map(row => `${row.querySelector('dt')!.textContent.trim()}=${row.querySelector('dd')!.textContent.trim()}`);
    expect(summary).toEqual([
      'Wins=1',
      'Losses=1',
      'Average K / D / A=7 / 4 / 7',
      'Last hits=200',
      'Gold per minute=550',
      'Experience per minute=650',
      'Abandoned=1'
    ]);
  });

  it('uses the singular title for a single match and hides the abandons when there are none', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile({ matches: 1 })));
    player.set(makePlayer());
    create();

    const titles = Array.from(el().querySelectorAll('igx-card [igxCardHeaderTitle]')).map(t => t.textContent.trim());
    expect(titles).toContain('Last match');
    const labels = Array.from(el().querySelectorAll('.dota-summary dt')).map(t => t.textContent.trim());
    expect(labels).not.toContain('Abandoned');
  });

  it('lists the most played heroes, naming the ones Steam did not return', () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile()));
    player.set(makePlayer());
    create();

    const heroes = Array.from(el().querySelectorAll('.top-heroes igx-list-item')).map(item => [
      item.querySelector('[igxListLineTitle]')!.textContent.trim(),
      item.querySelector('[igxListLineSubTitle]')!.textContent.trim(),
      item.querySelector('[igxListAction]')!.textContent.trim()
    ]);
    expect(heroes).toEqual([
      ['Anti-Mage', '1 match', '100% won'],
      ['Hero #2', '3 matches', '0% won']
    ]);
  });

  it('renders a row per recent match from the player perspective', async () => {
    vi.spyOn(apiService, 'getDota2Profile').mockReturnValue(of(makeProfile()));
    player.set(makePlayer());
    create();
    await render();

    expect(text('igx-grid-toolbar-title')).toBe('Recent matches');

    const rows = Array.from(el().querySelectorAll('igx-grid-row'));
    expect(rows.length).toBe(2);

    const cells = (row: Element) => Array.from(row.querySelectorAll('igx-grid-cell')).map(c => c.textContent.replace(/\s+/g, ' ').trim());
    const [lost, won] = rows.map(cells);
    expect(lost.slice(0, 6)).toEqual(['Axe', 'Loss', '4 / 6 / 8', '100', '400 / 500', '30:00']);
    expect(won.slice(0, 6)).toEqual(['Anti-Mage', 'Win (abandoned)', '10 / 2 / 6', '100', '400 / 500', '1:02:09']);
  });
});
