import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { of, Subject } from 'rxjs';

import { ScPlayerComponent } from './sc-player.component';
import { ApplicationUser, BellumgensApiService, Tournament } from '../../../../../common/src/public_api';

const makePlayer = (overrides: Partial<ApplicationUser> = {}): ApplicationUser => ({
  id: 'player-1',
  steamId: null,
  username: 'Serral',
  battleNetId: 'bnet-1',
  email: null,
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  sc2Details: {
    battleNetId: 'bnet-1',
    battleNetBattleTag: 'Serral#1234',
    avatarUrl: 'https://example.com/avatar.png',
    profileUrl: 'https://starcraft2.com/profile/1',
    regionId: 2,
    realmId: 1
  },
  ...overrides
});

const opponent = (id: string, username: string) => ({ id, username, avatarUrl: '' }) as ApplicationUser;

const makeTournament = (id: string, name: string, winners: string []): Tournament => ({
  id,
  name,
  sc2Matches: winners.map((winnerPlayerId, i) => ({
    id: `${id}-m${i}`,
    startTime: new Date('2024-01-15T18:00:00Z'),
    player1Id: 'player-1',
    player2Id: 'player-2',
    player1: opponent('player-1', 'Serral'),
    player2: opponent('player-2', 'Maru'),
    winnerPlayerId
  }))
} as Tournament);

describe('ScPlayerComponent', () => {
  let component: ScPlayerComponent;
  let fixture: ComponentFixture<ScPlayerComponent>;
  let player: WritableSignal<ApplicationUser>;
  let apiService: BellumgensApiService;
  let title: Title;

  beforeEach(async () => {
    player = signal<ApplicationUser>(null);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        ScPlayerComponent
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
    fixture = TestBed.createComponent(ScPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;

  it('renders nothing and loads nothing while there is no player', () => {
    const spy = vi.spyOn(apiService, 'getPlayerTournaments');
    create();

    expect(el().querySelector('.profile-view-layout')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows the loading indicator while the player is loading', () => {
    apiService['_loadingPlayer'].set(true);
    create();

    expect(el().querySelector('bg-loading')).not.toBeNull();

    apiService['_loadingPlayer'].set(false);
    fixture.detectChanges();
    expect(el().querySelector('bg-loading')).toBeNull();
  });

  it('renders the battle tag, profile link and username of the player', () => {
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of([]));
    player.set(makePlayer());
    create();

    const link = el().querySelector<HTMLAnchorElement>('h1 a');
    expect(link.textContent.trim()).toBe('Serral#1234');
    expect(link.getAttribute('href')).toBe('https://starcraft2.com/profile/1');
    expect(el().querySelector('.player-avatar')).not.toBeNull();
    expect(el().querySelector('h4').textContent.trim()).toBe('Serral');
  });

  it('only renders the username when the player has no StarCraft II details', () => {
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of([]));
    player.set(makePlayer({ sc2Details: null }));
    create();

    expect(el().querySelector('h1')).toBeNull();
    expect(el().querySelector('.player-avatar')).toBeNull();
    expect(el().querySelector('h4').textContent.trim()).toBe('Serral');
  });

  it('sets the page title from the battle tag', () => {
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of([]));
    player.set(makePlayer());
    create();

    expect(title.getTitle()).toBe('StarCraft II Player: Serral#1234');
  });

  it('does not set the page title when the steam user lookup failed', () => {
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of([]));
    title.setTitle('Unchanged');
    player.set(makePlayer({ steamUserException: true }));
    create();

    expect(title.getTitle()).toBe('Unchanged');
    // tournaments are still loaded for the player
    expect(apiService.getPlayerTournaments).toHaveBeenCalledWith('player-1');
  });

  it('loads the tournaments of the player', () => {
    const tournaments = [makeTournament('t1', 'Winter Cup', ['player-1'])];
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of(tournaments));
    player.set(makePlayer());
    create();

    expect(apiService.getPlayerTournaments).toHaveBeenCalledTimes(1);
    expect(apiService.getPlayerTournaments).toHaveBeenCalledWith('player-1');
    expect(component.tournaments()).toEqual(tournaments);
  });

  it('loads the tournaments only once per player id', () => {
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of([]));
    player.set(makePlayer());
    create();

    // the parent hands down a new object for the same player (e.g. after a refresh)
    player.set(makePlayer({ username: 'Serral (updated)' }));
    fixture.detectChanges();
    expect(apiService.getPlayerTournaments).toHaveBeenCalledTimes(1);
    expect(el().querySelector('h4').textContent.trim()).toBe('Serral (updated)');

    player.set(makePlayer({ id: 'player-2', username: 'Maru' }));
    fixture.detectChanges();
    expect(apiService.getPlayerTournaments).toHaveBeenCalledTimes(2);
    expect(apiService.getPlayerTournaments).toHaveBeenLastCalledWith('player-2');
  });

  it('clears the previous tournaments and ignores a stale response after switching player', () => {
    const first = new Subject<Tournament []>();
    const second = new Subject<Tournament []>();
    vi.spyOn(apiService, 'getPlayerTournaments')
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);

    player.set(makePlayer());
    create();

    player.set(makePlayer({ id: 'player-2' }));
    fixture.detectChanges();
    expect(component.tournaments()).toEqual([]);

    // the response for the previous player arrives late and must not be shown
    first.next([makeTournament('t1', 'Stale Cup', [])]);
    expect(component.tournaments()).toEqual([]);

    const fresh = [makeTournament('t2', 'Fresh Cup', [])];
    second.next(fresh);
    expect(component.tournaments()).toEqual(fresh);
  });

  it('renders a grid per tournament with the result of every match from the player perspective', async () => {
    vi.spyOn(apiService, 'getPlayerTournaments').mockReturnValue(of([
      makeTournament('t1', 'Winter Cup', ['player-1', 'player-2', null]),
      makeTournament('t2', 'Summer Cup', ['player-1'])
    ]));
    player.set(makePlayer());
    create();
    await fixture.whenStable();
    fixture.detectChanges();

    const grids = el().querySelectorAll('igx-grid');
    expect(grids.length).toBe(2);

    const titles = Array.from(el().querySelectorAll('igx-grid-toolbar-title')).map(t => t.textContent.trim());
    expect(titles).toEqual(['Winter Cup', 'Summer Cup']);

    const results = Array.from(grids[0].querySelectorAll('.color-success, .color-error, .color-warn'))
      .map(r => `${r.className}:${r.textContent.trim()}`);
    expect(results).toEqual(['color-success:Win', 'color-error:Loss', 'color-warn:Pending']);
  });
});
