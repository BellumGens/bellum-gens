import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSearchComponent } from './quick-search.component';
import { Router, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import { By } from '@angular/platform-browser';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { ApiSearchService, ApplicationUser, CSGODetails, CSGOStrategy, CSGOTeam, SearchResult, SteamUser } from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';

const csgoDetails = (overrides: Partial<CSGODetails> = {}): CSGODetails => ({
  steamUser: null,
  userStats: null,
  headshotPercentage: 45.6,
  killDeathRatio: 1.5,
  accuracy: 20,
  steamPrivate: false,
  realName: 'Real Name',
  customUrl: null,
  avatarFull: '',
  avatarMedium: '',
  avatarIcon: '',
  ...overrides
});

const player = (id: string, username: string, details: CSGODetails, overrides: Partial<ApplicationUser> = {}): ApplicationUser => ({
  id,
  steamId: id,
  username,
  battleNetId: null,
  email: null,
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  csgoDetails: details,
  ...overrides
});

const team = (teamId: string, teamName: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: '',
  customUrl: `${teamId}-url`,
  visible: true
});

const strategy = (id: string, title: string, overrides: Partial<CSGOStrategy> = {}): CSGOStrategy => ({
  id,
  teamId: null,
  side: 0,
  title,
  description: '',
  url: '',
  map: 0,
  customUrl: `${id}-url`,
  ...overrides
});

const steamProfile = (country = 'bg', customURL = 'steam-custom'): SteamUser => ({
  steamID64: '76561198000000000',
  steamID: 'SteamName',
  avatarIcon: '',
  avatarMedium: '',
  avatarFull: '',
  realname: 'Steam Real Name',
  location: '',
  country,
  summary: '',
  customURL,
  groups: []
});

const steamUser = (overrides: Partial<ApplicationUser> = {}, country = 'bg', customURL = 'steam-custom'): ApplicationUser => ({
  ...player('steam-user', 'steam-user', null),
  steamUser: steamProfile(country, customURL),
  userStats: {
    headshotPercentage: 51.2,
    killDeathRatio: 1.1,
    accuracy: 18,
    private: false,
    favouriteWeapon: null,
    weapons: []
  },
  ...overrides
});

const result = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  steamUser: null,
  players: [],
  teams: [],
  strategies: [],
  ...overrides
});

describe('QuickSearchComponent', () => {
  let component: QuickSearchComponent;
  let fixture: ComponentFixture<QuickSearchComponent>;
  let apiService: ApiSearchService;
  let iconService: IgxIconService;
  let httpMock: HttpTestingController;
  let router: Router;
  const el = (): HTMLElement => fixture.nativeElement;
  const searchUrl = (name: string) => `${environment.apiEndpoint}/search?name=${name}`;

  const configure = async (platformId = 'browser') => {
    await TestBed.configureTestingModule({
      imports: [
        QuickSearchComponent
      ],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: platformId },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    apiService = TestBed.inject(ApiSearchService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    iconService = TestBed.inject(IgxIconService);
    vi.spyOn(iconService, 'addSvgIcon').mockImplementation(() => undefined);
  };

  const create = () => {
    fixture = TestBed.createComponent(QuickSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  /** Runs a quick search through the service and answers it with `data`. */
  const search = async (term: string, data: SearchResult) => {
    apiService.quickSearch(term);
    httpMock.expectOne(searchUrl(term)).flush(data);
    await fixture.whenStable();
  };

  const lists = () => Array.from(el().querySelectorAll<HTMLElement>('igx-list'));
  const titles = (list: HTMLElement) =>
    Array.from(list.querySelectorAll('[igxListLineTitle]')).map(t => t.textContent.trim());
  const moreButton = (list: HTMLElement) => list.querySelector<HTMLButtonElement>('button.submit-button');

  afterEach(() => {
    httpMock.verify();
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await configure();
      create();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should register the headshot icon', () => {
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
    });

    it('should initialize with empty search result', () => {
      expect(component.searchResult()).toEqual({ steamUser: null, players: [], teams: [], strategies: [] });
    });

    it('should initialize loading as false', () => {
      expect(component.loading()).toBe(false);
    });

    it('should initialize term as empty string', () => {
      expect(component.term()).toBe('');
    });

    it('should render the empty messages for players, teams and strategies', async () => {
      await fixture.whenStable();

      expect(el().textContent).toContain('No matching players...');
      expect(el().textContent).toContain('No matching teams...');
      expect(el().textContent).toContain('No matching strategies...');
      expect(el().textContent).not.toContain('Steam User');
      expect(el().querySelectorAll('button.submit-button').length).toBe(0);
    });

    it('should show the loading templates while the quick search is in flight', async () => {
      apiService.quickSearch('bel');
      await fixture.whenStable();

      expect(component.loading()).toBe(true);
      expect(component.term()).toBe('bel');
      expect(el().textContent).toContain('Loading players...');
      expect(el().textContent).toContain('Loading teams...');
      expect(el().textContent).toContain('Loading strategies...');

      httpMock.expectOne(searchUrl('bel')).flush(result());
      await fixture.whenStable();

      expect(component.loading()).toBe(false);
      expect(el().textContent).not.toContain('Loading players...');
    });

    it('should stop loading and keep the empty result when the quick search fails', async () => {
      apiService.quickSearch('bel');
      httpMock.expectOne(searchUrl('bel')).flush('boom', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(component.loading()).toBe(false);
      expect(component.searchResult()).toEqual(result());
      expect(el().textContent).toContain('No matching players...');
    });

    it('should update searchResult when apiService emits new data', async () => {
      await search('player', result({ players: [player('1', 'player1', csgoDetails())] }));

      expect(component.searchResult().players.length).toBe(1);
    });

    it('should render the matched players with their stats', async () => {
      await search('pl', result({
        players: [
          player('1', 'player1', csgoDetails({ customUrl: 'custom-one' }), { steamUser: steamProfile('bg') }),
          player('2', 'player2', csgoDetails({ realName: 'Second Real' })),
          player('3', 'player3', csgoDetails({ steamUser: steamProfile('rs') }))
        ]
      }));

      const [players] = lists();
      expect(titles(players)).toEqual(['player1', 'player2', 'player3']);
      expect(players.textContent).toContain('Real Name');
      expect(players.textContent).toContain('Second Real');
      expect(players.textContent).toContain('1.5');
      expect(players.textContent).toContain('45.60%');
      expect(players.textContent).not.toContain('No matching players...');
      // The country comes from the steam profile, rendered as a small flag avatar.
      const flags = Array.from(players.querySelectorAll<HTMLElement>('igx-avatar.country-badge-small'));
      expect(flags.map(f => f.getAttribute('title'))).toEqual(['bg', 'rs']);
      expect(moreButton(players)).toBeNull();
    });

    it('should use the real name of the players for the avatar initials', async () => {
      await search('pl', result({ players: [player('1', 'player1', csgoDetails({ realName: 'Real Name' }))] }));

      const avatar = fixture.debugElement.query(By.css('igx-list-item.result-item igx-avatar[igxListThumbnail]'))
        .injector.get(IgxAvatarComponent);
      expect(avatar.initials).toBe('Real Name');
    });

    it('should mark players with private steam profiles', async () => {
      await search('pl', result({ players: [player('1', 'player1', csgoDetails({ steamPrivate: true }))] }));

      const [players] = lists();
      expect(players.textContent).toContain('Private');
      expect(players.querySelector('[igxListAction]')).toBeNull();
    });

    it('should render players without counter-strike details', async () => {
      await search('pl', result({ players: [player('1', 'player1', undefined)] }));

      const [players] = lists();
      expect(titles(players)).toEqual(['player1']);
      expect(players.querySelector('[igxListAction]')).toBeNull();
      expect(players.querySelector('igx-avatar.country-badge-small')).toBeNull();
      expect(players.textContent).not.toContain('Private');
    });

    it('should link players to their profile by custom url, falling back to the id', async () => {
      await search('pl', result({ players: [player('1', 'player1', csgoDetails({ customUrl: 'custom-one' })), player('2', 'player2', csgoDetails())] }));

      const items = Array.from(lists()[0].querySelectorAll<HTMLElement>('igx-list-item a.item-link'));
      expect(items.map(i => i.getAttribute('href'))).toEqual(['/players/custom-one', '/players/2']);
      // The items are no longer links themselves, so they don't need to be focusable.
      expect(lists()[0].querySelector('igx-list-item[tabindex]')).toBeNull();
      items[0].click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/players', 'custom-one']), expect.anything());
      items[1].click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/players', '2']), expect.anything());
    });

    it('should show at most three players and a link to view more', async () => {
      await search('many', result({
        players: ['1', '2', '3', '4'].map(id => player(id, `player${id}`, csgoDetails()))
      }));

      const [players] = lists();
      expect(titles(players)).toEqual(['player1', 'player2', 'player3']);
      const more = moreButton(players);
      expect(more.textContent.trim()).toBe('View more players...');

      more.click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/search/players', 'name=many']), expect.anything());
    });

    it('should render the matched steam user with stats and a flag', async () => {
      await search('steam', result({ steamUser: steamUser() }));

      const [players] = lists();
      expect(players.textContent).toContain('Steam User');
      expect(titles(players)).toEqual(['SteamName']);
      expect(players.textContent).toContain('Steam Real Name');
      expect(players.textContent).toContain('1.1');
      expect(players.textContent).toContain('51.20%');
      expect(players.querySelector('igx-avatar.country-badge-small').getAttribute('title')).toBe('bg');

      players.querySelector<HTMLElement>('igx-list-item a.item-link').click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/players', 'steam-custom']), expect.anything());
    });

    it('should mark a steam user with private stats and link by steam id without a custom url', async () => {
      await search('steam', result({ steamUser: steamUser({ userStatsException: true, userStats: null }, null, null) }));

      const [players] = lists();
      expect(players.textContent).toContain('Private');
      expect(players.querySelector('[igxListAction]')).toBeNull();
      expect(players.querySelector('igx-avatar.country-badge-small')).toBeNull();

      players.querySelector<HTMLElement>('igx-list-item a.item-link').click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/players', '76561198000000000']), expect.anything());
    });

    it('should render a steam user without stats with a zero KDR', async () => {
      await search('steam', result({ steamUser: steamUser({ userStats: undefined }) }));

      const [players] = lists();
      expect(players.querySelector('[igxListAction]')).not.toBeNull();
      expect(players.textContent).not.toContain('Private');
    });

    it('should not render the steam user section when the steam profile is missing', async () => {
      await search('steam', result({ steamUser: steamUser({ steamUser: null }) }));

      expect(el().textContent).not.toContain('Steam User');
    });

    it('should render the matched teams and link to them', async () => {
      await search('tm', result({ teams: [team('t1', 'Team One'), team('t2', 'Team Two')] }));

      const teams = lists()[1];
      expect(titles(teams)).toEqual(['Team One', 'Team Two']);
      expect(teams.textContent).not.toContain('No matching teams...');
      expect(moreButton(teams)).toBeNull();

      teams.querySelector<HTMLElement>('igx-list-item a.item-link').click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/team', 't1-url']), expect.anything());
    });

    it('should show at most three teams and a link to view more', async () => {
      await search('tm', result({ teams: ['1', '2', '3', '4'].map(id => team(`t${id}`, `Team ${id}`)) }));

      const teams = lists()[1];
      expect(titles(teams)).toEqual(['Team 1', 'Team 2', 'Team 3']);
      const more = moreButton(teams);
      expect(more.textContent.trim()).toBe('View more teams...');

      more.click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/search/teams', 'name=tm']), expect.anything());
    });

    it('should render the matched strategies', async () => {
      await search('st', result({ strategies: [strategy('s1', 'Rush B', { stratImage: 'https://example.com/s1.png' })] }));

      const strategies = lists()[2];
      expect(titles(strategies)).toEqual(['Rush B']);
      expect(strategies.textContent).not.toContain('No matching strategies...');
      expect(moreButton(strategies)).toBeNull();
      const avatar = fixture.debugElement.queryAll(By.css('igx-list-item.result-item igx-avatar[igxListThumbnail]'))
        .map(a => a.injector.get(IgxAvatarComponent))
        .find(a => a.initials === 'Rush B');
      expect(avatar.src).toBe('https://example.com/s1.png');
    });

    it('should link strategies to their details by custom url, falling back to the id', async () => {
      await search('st', result({ strategies: [strategy('s1', 'Rush B'), strategy('s2', 'Long A', { customUrl: null })] }));

      const items = Array.from(lists()[2].querySelectorAll<HTMLElement>('igx-list-item a.item-link'));
      items[0].click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/strategies', 'details', 's1-url']), expect.anything());
      items[1].click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/strategies', 'details', 's2']), expect.anything());
    });

    it('should show at most three strategies and a link to view more', async () => {
      await search('st', result({ strategies: ['1', '2', '3', '4'].map(id => strategy(`s${id}`, `Strat ${id}`)) }));

      const strategies = lists()[2];
      expect(titles(strategies)).toEqual(['Strat 1', 'Strat 2', 'Strat 3']);
      const more = moreButton(strategies);
      expect(more.textContent.trim()).toBe('View more strategies...');

      more.click();
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(router.createUrlTree(['/strategies', 'name=st']), expect.anything());
    });

    it('should reuse the cached result for a repeated term without a new request', async () => {
      await search('tm', result({ teams: [team('t1', 'Team One')] }));
      await search('other', result());
      expect(titles(lists()[1])).toEqual([]);

      apiService.quickSearch('tm');
      await fixture.whenStable();

      httpMock.expectNone(searchUrl('tm'));
      expect(component.term()).toBe('tm');
      expect(titles(lists()[1])).toEqual(['Team One']);
    });
  });

  describe('on the server', () => {
    beforeEach(async () => {
      await configure('server');
      create();
    });

    it('should not register the headshot icon', () => {
      expect(component).toBeTruthy();
      expect(iconService.addSvgIcon).not.toHaveBeenCalled();
    });
  });
});
