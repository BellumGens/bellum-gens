import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, ROUTER_OUTLET_DATA } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IgxSelectComponent } from '@infragistics/igniteui-angular/select';
import { BehaviorSubject, of, Subject } from 'rxjs';

import { CsPlayerComponent } from './cs-player.component';
import {
  ALL_ROLES,
  ApplicationUser,
  Availability,
  BellumgensApiService,
  CSGOMap,
  CSGOMapPool,
  CSGOTeam,
  DayOfWeek,
  LoginService,
  PlaystyleRole
} from '../../../../../common/src/public_api';

const makePlayer = (overrides: Partial<ApplicationUser> = {}): ApplicationUser => ({
  id: 'player-1',
  steamId: '76561198000000001',
  username: 'sn1per',
  battleNetId: null,
  email: null,
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  steamUser: {
    steamID64: '76561198000000001',
    steamID: 'sn1per',
    avatarIcon: '',
    avatarMedium: '',
    avatarFull: 'https://example.com/full.png',
    realname: 'John Sniper',
    location: '',
    country: '',
    summary: '',
    customURL: 'sn1per',
    groups: []
  },
  userStats: {
    headshotPercentage: 48,
    killDeathRatio: 1.2,
    accuracy: 19,
    private: false,
    favouriteWeapon: { name: 'awp', kills: 900, accuracy: 30 },
    weapons: [
      { name: 'ak47', kills: 500, accuracy: 20 },
      { name: 'awp', kills: 900, accuracy: 30 },
      { name: 'headshot', kills: 1000, accuracy: 0 }
    ]
  },
  csgoDetails: {
    primaryRole: PlaystyleRole.Awper,
    secondaryRole: PlaystyleRole.Support
  } as ApplicationUser['csgoDetails'],
  ...overrides
});

const makeUser = (overrides: Partial<ApplicationUser> = {}): ApplicationUser => ({
  ...makePlayer(),
  id: 'user-1',
  steamId: '76561198000000099',
  ...overrides
});

const team = (teamId: string, teamName: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: '',
  visible: true,
  customUrl: teamId
});

describe('CsPlayerComponent', () => {
  let component: CsPlayerComponent;
  let fixture: ComponentFixture<CsPlayerComponent>;
  let player: WritableSignal<ApplicationUser>;
  let authUser: WritableSignal<ApplicationUser>;
  let teamsAdmin: WritableSignal<CSGOTeam []>;
  let parentParams: BehaviorSubject<Record<string, string>>;
  let apiService: BellumgensApiService;
  let loginService: LoginService;
  let iconService: IgxIconService;
  let title: Title;

  beforeEach(async () => {
    player = signal<ApplicationUser>(null);
    parentParams = new BehaviorSubject<Record<string, string>>({});

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        CsPlayerComponent
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { params: parentParams },
            data: new BehaviorSubject({})
          }
        },
        { provide: ROUTER_OUTLET_DATA, useValue: player },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    apiService = TestBed.inject(BellumgensApiService);
    loginService = TestBed.inject(LoginService);
    iconService = TestBed.inject(IgxIconService);
    title = TestBed.inject(Title);

    // the service's own state; its lazy getters hand these out read-only
    authUser = loginService['_applicationUser'];
    teamsAdmin = loginService['_teamsAdmin'];
    vi.spyOn(iconService, 'addSvgIcon').mockImplementation(() => undefined);
    vi.spyOn(apiService, 'getUserTeams').mockReturnValue(of([]));
    vi.spyOn(apiService, 'getAvailability').mockReturnValue(of([]));
    vi.spyOn(apiService, 'getMapPool').mockReturnValue(of([]));
  });

  const create = () => {
    fixture = TestBed.createComponent(CsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;

  describe('without a usable player', () => {
    it('shows the not found message when there is no player', () => {
      create();

      expect(el().querySelector('.loading-overview').textContent).toContain('player profile not found');
      expect(el().querySelector('.profile-view-layout')).toBeNull();
      expect(apiService.getUserTeams).not.toHaveBeenCalled();
    });

    it('shows the not found message and loads nothing when the steam lookup failed', () => {
      player.set(makePlayer({ steamUserException: true }));
      create();

      expect(el().querySelector('.loading-overview')).not.toBeNull();
      expect(el().querySelector('.profile-view-layout')).toBeNull();
      // only the default title from the route data
      expect(title.getTitle()).not.toContain('Counter-Strike Player');
      expect(apiService.getUserTeams).not.toHaveBeenCalled();
      expect(apiService.getAvailability).not.toHaveBeenCalled();
      expect(apiService.getMapPool).not.toHaveBeenCalled();
    });

    it('shows the loading indicator while the player is loading', () => {
      apiService['_loadingPlayer'].set(true);
      create();

      expect(el().querySelector('bg-loading')).not.toBeNull();
    });
  });

  describe('rendering a player', () => {
    it('renders the steam profile and stats', () => {
      player.set(makePlayer());
      create();

      expect(el().querySelector('.loading-overview')).toBeNull();
      expect(el().querySelector('bg-loading')).toBeNull();
      const link = el().querySelector<HTMLAnchorElement>('h1 a');
      expect(link.textContent.trim()).toBe('sn1per');
      expect(el().querySelector('h4[igxCardHeaderSubtitle]').textContent.trim()).toBe('John Sniper');
      expect(el().querySelectorAll('.player-detail__stats').length).toBe(7);
      expect(el().querySelector('.top-weapon h5').textContent.trim()).toBe('awp');
      expect(el().querySelector('.player-exception')).toBeNull();
      expect(el().querySelectorAll('.role-select').length).toBe(2);
    });

    it('lists the top weapons sorted by kills, without the non-weapon stats', () => {
      player.set(makePlayer());
      create();

      const weapons = Array.from(el().querySelectorAll('igx-list-item [igxListLineTitle]')).map(w => w.textContent.trim());
      expect(weapons).toEqual(['awp', 'ak47']);
    });

    it('registers the weapon icons of the player', () => {
      player.set(makePlayer());
      create();

      expect(iconService.addSvgIcon).toHaveBeenCalledTimes(2);
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('awp', '/assets/weapon-icons/svg_normal/weapon_awp.svg', 'weapon-icons');
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('ak47', '/assets/weapon-icons/svg_normal/weapon_ak47.svg', 'weapon-icons');
    });

    it('renders the country badge when the player has a country', () => {
      player.set(makePlayer({ steamUser: { ...makePlayer().steamUser, country: 'BG' } }));
      create();

      expect(el().querySelector('.country-badge-large')).not.toBeNull();
    });

    it('shows the private account notice and hides stats and roles when steam stats are private', () => {
      player.set(makePlayer({ userStatsException: true, userStats: null }));
      create();

      expect(el().querySelector('.player-exception').textContent).toContain('Steam account is private.');
      expect(el().querySelector('.player-detail__stats')).toBeNull();
      expect(el().querySelector('.role-select')).toBeNull();
      expect(iconService.addSvgIcon).not.toHaveBeenCalled();
    });

    it('sets the page title from the steam id', () => {
      player.set(makePlayer());
      create();

      expect(title.getTitle()).toBe('Counter-Strike Player: sn1per');
    });

    it('welcomes a new user coming from registration', () => {
      parentParams.next({ newuser: 'true' });
      player.set(makePlayer());
      create();

      expect(el().textContent).toContain('Now it\'s time to complete your profile!');
    });

    it('does not show the welcome for a regular visit', () => {
      player.set(makePlayer());
      create();

      expect(el().textContent).not.toContain('Now it\'s time to complete your profile!');
    });

    it('toggles between active duty and all maps', () => {
      player.set(makePlayer());
      create();

      const header = () => el().querySelector('.map-pool h4').textContent.trim();
      expect(header()).toBe('Showing Active Duty Maps');

      el().querySelector<HTMLButtonElement>('.map-pool button').click();
      fixture.detectChanges();

      expect(component.viewAll()).toBe(true);
      expect(header()).toBe('Showing All Maps');
      expect(fixture.debugElement.query(By.css('app-map-pool')).componentInstance.viewAll()).toBe(true);
    });
  });

  describe('profile details', () => {
    it('loads teams, availability and map pool of a registered player', () => {
      const teams = [team('t1', 'Team One')];
      const availability: Availability [] = [{ day: DayOfWeek.Monday, available: true, from: new Date(), to: new Date() }];
      const mapPool: CSGOMapPool [] = [{ mapId: CSGOMap.Mirage, isPlayed: true }];
      vi.mocked(apiService.getUserTeams).mockReturnValue(of(teams));
      vi.mocked(apiService.getAvailability).mockReturnValue(of(availability));
      vi.mocked(apiService.getMapPool).mockReturnValue(of(mapPool));
      player.set(makePlayer());
      create();

      expect(apiService.getUserTeams).toHaveBeenCalledWith('player-1');
      expect(apiService.getAvailability).toHaveBeenCalledWith('player-1');
      expect(apiService.getMapPool).toHaveBeenCalledWith('player-1');
      expect(component.userTeams()).toEqual(teams);
      expect(el().querySelectorAll('.team-avatar-link').length).toBe(1);
      expect(fixture.debugElement.query(By.css('bg-availability')).componentInstance.availability()).toEqual(availability);
      expect(fixture.debugElement.query(By.css('app-map-pool')).componentInstance.mapPool()).toEqual(mapPool);
    });

    it('does not load profile details for an unregistered player and offers to register', () => {
      const openLogin = vi.spyOn(loginService, 'emitOpenLogin').mockImplementation(() => undefined);
      player.set(makePlayer({ registered: false }));
      create();

      expect(apiService.getUserTeams).not.toHaveBeenCalled();
      expect(apiService.getAvailability).not.toHaveBeenCalled();
      expect(apiService.getMapPool).not.toHaveBeenCalled();

      const register = el().querySelector<HTMLElement>('.navigatable');
      expect(register.textContent.trim()).toBe('register');
      register.click();
      expect(openLogin).toHaveBeenCalledTimes(1);
    });

    it('loads the profile details only once per player id', () => {
      player.set(makePlayer());
      create();

      // a role change hands down a new object for the same player
      player.set(makePlayer({ csgoDetails: { primaryRole: PlaystyleRole.IGL } as ApplicationUser['csgoDetails'] }));
      fixture.detectChanges();
      expect(apiService.getUserTeams).toHaveBeenCalledTimes(1);
      expect(apiService.getAvailability).toHaveBeenCalledTimes(1);
      expect(apiService.getMapPool).toHaveBeenCalledTimes(1);
      expect(component.csgoDetails().primaryRole).toBe(PlaystyleRole.IGL);

      player.set(makePlayer({ id: 'player-2' }));
      fixture.detectChanges();
      expect(apiService.getUserTeams).toHaveBeenCalledTimes(2);
      expect(apiService.getUserTeams).toHaveBeenLastCalledWith('player-2');
    });

    it('ignores a late teams response for a previously viewed player', () => {
      const first = new Subject<CSGOTeam []>();
      const second = new Subject<CSGOTeam []>();
      vi.mocked(apiService.getUserTeams).mockReturnValueOnce(first).mockReturnValueOnce(second);
      player.set(makePlayer());
      create();

      player.set(makePlayer({ id: 'player-2' }));
      fixture.detectChanges();

      first.next([team('old', 'Old Team')]);
      expect(component.userTeams()).toEqual([]);

      second.next([team('new', 'New Team')]);
      expect(component.userTeams()).toEqual([team('new', 'New Team')]);
    });

    it('does not carry the previous player\'s availability and map pool over to the next player', () => {
      const monday: Availability = { day: DayOfWeek.Monday, available: true, from: new Date(), to: new Date() };
      vi.mocked(apiService.getAvailability).mockReturnValue(of([monday]));
      vi.mocked(apiService.getMapPool).mockReturnValue(of([{ mapId: CSGOMap.Mirage, isPlayed: true }]));
      player.set(makePlayer());
      create();
      expect(component.availability()).toEqual([monday]);

      player.set(makePlayer({ id: 'player-2', registered: false }));
      fixture.detectChanges();

      expect(component.availability()).toBeNull();
      expect(component.mapPool()).toBeNull();
    });

    it('ignores late availability and map pool responses for a previously viewed player', () => {
      const firstAvailability = new Subject<Availability []>();
      const firstMapPool = new Subject<CSGOMapPool []>();
      vi.mocked(apiService.getAvailability).mockReturnValueOnce(firstAvailability).mockReturnValueOnce(of([]));
      vi.mocked(apiService.getMapPool).mockReturnValueOnce(firstMapPool).mockReturnValueOnce(of([]));
      player.set(makePlayer());
      create();

      player.set(makePlayer({ id: 'player-2' }));
      fixture.detectChanges();

      firstAvailability.next([{ day: DayOfWeek.Monday, available: true, from: new Date(), to: new Date() }]);
      firstMapPool.next([{ mapId: CSGOMap.Mirage, isPlayed: true }]);
      expect(component.availability()).toEqual([]);
      expect(component.mapPool()).toEqual([]);
    });
  });

  describe('playerIsUser', () => {
    it('is false when logged out', () => {
      player.set(makePlayer());
      create();

      expect(component.playerIsUser()).toBe(false);
    });

    it('is false when viewing someone else', () => {
      authUser.set(makeUser());
      player.set(makePlayer());
      create();

      expect(component.playerIsUser()).toBe(false);
    });

    it('is true when viewing the own profile', () => {
      authUser.set(makeUser({ steamId: '76561198000000001' }));
      player.set(makePlayer());
      create();

      expect(component.playerIsUser()).toBe(true);
    });

    it('makes roles, availability and map pool editable only on the own profile', async () => {
      player.set(makePlayer());
      create();
      // ngModel applies [disabled] to the select asynchronously
      await fixture.whenStable();

      const selects = () => fixture.debugElement.queryAll(By.directive(IgxSelectComponent))
        .map(s => (s.componentInstance as IgxSelectComponent).disabled);
      const availability = () => fixture.debugElement.query(By.css('bg-availability')).componentInstance;
      const mapPool = () => fixture.debugElement.query(By.css('app-map-pool')).componentInstance;

      expect(selects()).toEqual([true, true]);
      expect(availability().editable()).toBe(false);
      expect(mapPool().readOnly()).toBe(true);

      authUser.set(makeUser({ steamId: '76561198000000001' }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(selects()).toEqual([false, false]);
      expect(availability().editable()).toBe(true);
      expect(mapPool().readOnly()).toBe(false);
    });
  });

  describe('editing the own profile', () => {
    beforeEach(() => {
      authUser.set(makeUser({ id: 'player-1', steamId: '76561198000000001' }));
      player.set(makePlayer());
      create();
    });

    it('submits availability changes for the logged in user', () => {
      vi.spyOn(apiService, 'setAvailability').mockReturnValue(of(null));
      const day: Availability = { day: DayOfWeek.Friday, available: true, from: new Date(), to: new Date() };

      fixture.debugElement.query(By.css('bg-availability')).triggerEventHandler('availabilityChanged', day);

      expect(apiService.setAvailability).toHaveBeenCalledWith({ ...day, userId: 'player-1' });
    });

    it('submits map pool changes for the logged in user', () => {
      vi.spyOn(apiService, 'setMapPool').mockReturnValue(of(null));
      const map: CSGOMapPool = { mapId: CSGOMap.Nuke, isPlayed: true };

      fixture.debugElement.query(By.css('app-map-pool')).triggerEventHandler('update', map);

      expect(apiService.setMapPool).toHaveBeenCalledWith({ ...map, userId: 'player-1' });
    });

    it('sets the primary role and shows it immediately', () => {
      vi.spyOn(apiService, 'setPrimaryRole').mockReturnValue(of(null));

      component.selectPrimary(PlaystyleRole.IGL);

      expect(apiService.setPrimaryRole).toHaveBeenCalledWith(ALL_ROLES.find(r => r.id === PlaystyleRole.IGL), 'player-1');
      expect(component.csgoDetails().primaryRole).toBe(PlaystyleRole.IGL);
      expect(component.csgoDetails().secondaryRole).toBe(PlaystyleRole.Support);
    });

    it('sets the secondary role and shows it immediately', () => {
      vi.spyOn(apiService, 'setSecondaryRole').mockReturnValue(of(null));

      component.selectSecondary(PlaystyleRole.Lurker);

      expect(apiService.setSecondaryRole).toHaveBeenCalledWith(ALL_ROLES.find(r => r.id === PlaystyleRole.Lurker), 'player-1');
      expect(component.csgoDetails().secondaryRole).toBe(PlaystyleRole.Lurker);
      expect(component.csgoDetails().primaryRole).toBe(PlaystyleRole.Awper);
    });

    it('does not offer to invite yourself to a team', () => {
      teamsAdmin.set([team('t1', 'Team One')]);
      fixture.detectChanges();

      expect(el().querySelector('button[title="Invite to team"]')).toBeNull();
    });
  });

  describe('inviting to a team', () => {
    it('is not offered when logged out', () => {
      teamsAdmin.set([team('t1', 'Team One')]);
      player.set(makePlayer());
      create();

      expect(component.teamsAdmin()).toBeNull();
      expect(el().querySelector('button[title="Invite to team"]')).toBeNull();
    });

    it('is not offered when the user administers no teams', () => {
      authUser.set(makeUser());
      teamsAdmin.set([]);
      player.set(makePlayer());
      create();

      expect(el().querySelector('button[title="Invite to team"]')).toBeNull();
    });

    it('is not offered for an unregistered player', () => {
      authUser.set(makeUser());
      teamsAdmin.set([team('t1', 'Team One')]);
      player.set(makePlayer({ registered: false }));
      create();

      expect(el().querySelector('button[title="Invite to team"]')).toBeNull();
    });

    it('invites the player to the selected team', () => {
      const teams = [team('t1', 'Team One'), team('t2', 'Team Two')];
      authUser.set(makeUser());
      teamsAdmin.set(teams);
      player.set(makePlayer());
      vi.spyOn(apiService, 'inviteToTeam').mockReturnValue(of(null));
      create();

      expect(el().querySelector('button[title="Invite to team"]')).not.toBeNull();

      fixture.debugElement.query(By.css('igx-drop-down'))
        .triggerEventHandler('selectionChanging', { newSelection: { value: teams[1] } });

      expect(apiService.inviteToTeam).toHaveBeenCalledWith(makePlayer().steamUser, teams[1]);
    });
  });
});
