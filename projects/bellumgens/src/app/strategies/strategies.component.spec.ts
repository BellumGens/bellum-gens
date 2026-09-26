import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategiesComponent } from './strategies.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute, Params, provideRouter, UrlSegment } from '@angular/router';
import { BehaviorSubject, config, of, throwError } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { IChipSelectEventArgs } from '@infragistics/igniteui-angular/chips';
import {
  ApiSearchService,
  ApiStrategiesService,
  ApplicationUser,
  BellumgensApiService,
  CommunicationService,
  CSGOMap,
  CSGOStrategy,
  CSGOTeam,
  LoginService,
  Side,
  SocialMediaStrategyService,
  StratOrderBy,
  VoteDirection
} from '../../../../common/src/public_api';

const strat = (id: string, overrides: Partial<CSGOStrategy> = {}): CSGOStrategy => ({
  id,
  teamId: null,
  side: Side.TSide,
  title: `Strat ${id}`,
  description: `Description ${id}`,
  url: '',
  map: CSGOMap.Inferno,
  customUrl: `strat-${id}`,
  votes: [],
  ...overrides
});

describe('StrategiesComponent', () => {
  let fixture: ComponentFixture<StrategiesComponent>;
  let component: StrategiesComponent;
  let url$: BehaviorSubject<UrlSegment []>;
  let parentParams$: BehaviorSubject<Params>;
  let params$: BehaviorSubject<Params>;
  let user: WritableSignal<ApplicationUser>;
  let loginService: LoginService;
  let strategiesService: ApiStrategiesService;
  let searchService: ApiSearchService;
  let apiService: BellumgensApiService;
  let commService: CommunicationService;

  const renderedTitles = (): string [] =>
    Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('h2.strat-title')).map(h => h.textContent.trim());

  // Opens the actions drop-down of the first card and returns its item labels.
  const openActions = async (): Promise<string []> => {
    const more = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('igx-icon'))
      .find(i => i.textContent.trim() === 'more_vert');
    more.click();
    await fixture.whenStable();

    return Array.from<HTMLElement>(document.querySelectorAll('igx-drop-down-item .dd-item-content span'))
      .map(i => i.textContent.trim());
  };

  const create = async () => {
    fixture = TestBed.createComponent(StrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    url$ = new BehaviorSubject<UrlSegment []>([]);
    parentParams$ = new BehaviorSubject<Params>({});
    params$ = new BehaviorSubject<Params>({});

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        StrategiesComponent
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            url: url$,
            params: params$,
            parent: { parent: { params: parentParams$ } }
          }
        },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    loginService = TestBed.inject(LoginService);
    strategiesService = TestBed.inject(ApiStrategiesService);
    searchService = TestBed.inject(ApiSearchService);
    apiService = TestBed.inject(BellumgensApiService);
    commService = TestBed.inject(CommunicationService);

    // Pretend the logged in user check is already running, so reading the user doesn't hit the network.
    loginService['_userCheckInProgress'].set(true);
    user = loginService['_applicationUser'];
    vi.spyOn(strategiesService, 'loadStrategiesPage').mockImplementation(() => undefined);
  });

  describe('public strategies', () => {
    beforeEach(async () => {
      strategiesService['_strategies'].set([strat('1'), strat('2', { map: CSGOMap.Mirage })]);
      strategiesService['_hasMoreStrats'].set(true);
      await create();
    });

    it('mirrors the service strategies, loading and hasMore state', async () => {
      expect(component.strats().map(s => s.id)).toEqual(['1', '2']);
      expect(component.hasMore()).toBe(true);
      expect(component.loading()).toBe(false);

      strategiesService['_loadingStrategies'].set(true);
      strategiesService['_strategies'].set([strat('3')]);
      strategiesService['_hasMoreStrats'].set(false);
      await fixture.whenStable();

      expect(component.loading()).toBe(true);
      expect(component.strats().map(s => s.id)).toEqual(['3']);
      expect(component.hasMore()).toBe(false);
      expect(fixture.nativeElement.querySelector('bg-loading')).toBeTruthy();
    });

    it('renders a card per strategy', () => {
      expect(renderedTitles()).toEqual(['Strat 1', 'Strat 2']);
      expect(fixture.nativeElement.textContent).not.toContain('No strategies found...');
    });

    it('shows the empty message when there are no strategies', async () => {
      strategiesService['_strategies'].set([]);
      await fixture.whenStable();

      expect(renderedTitles()).toEqual([]);
      expect(fixture.nativeElement.textContent).toContain('No strategies found...');
    });

    it('loads the next page from the load more card', async () => {
      const loadMore = fixture.nativeElement.querySelector('igx-avatar[icon="sync"]') as HTMLElement;
      expect(loadMore).toBeTruthy();

      loadMore.click();
      expect(component.page).toBe(1);
      expect(strategiesService.loadStrategiesPage).toHaveBeenLastCalledWith(1);

      component.loadMore();
      expect(component.page).toBe(2);
      expect(strategiesService.loadStrategiesPage).toHaveBeenLastCalledWith(2);
    });

    it('hides the load more card when there are no more strategies', async () => {
      strategiesService['_hasMoreStrats'].set(false);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('igx-avatar[icon="sync"]')).toBeNull();
    });

    it('filters the rendered list by the selected maps on user interaction only', async () => {
      const inferno = component.maps().find(m => m.mapId === CSGOMap.Inferno);

      component.changeMaps({ selected: false } as IChipSelectEventArgs, inferno);
      await fixture.whenStable();
      expect(component.maps().find(m => m.mapId === CSGOMap.Inferno).isPlayed).toBe(true);
      expect(renderedTitles()).toEqual(['Strat 1', 'Strat 2']);

      component.changeMaps({ selected: false, originalEvent: new MouseEvent('click') } as IChipSelectEventArgs, inferno);
      await fixture.whenStable();
      expect(component.maps().find(m => m.mapId === CSGOMap.Inferno).isPlayed).toBe(false);
      expect(component.maps().find(m => m.mapId === CSGOMap.Mirage).isPlayed).toBe(true);
      expect(renderedTitles()).toEqual(['Strat 2']);
    });

    it('shows strategies on inactive maps only when viewing all maps', async () => {
      strategiesService['_strategies'].set([strat('1'), strat('old', { map: CSGOMap.Dust2 })]);
      await fixture.whenStable();
      expect(renderedTitles()).toEqual(['Strat 1']);

      const toggle = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
        .find(b => b.textContent.includes('active duty maps'));
      toggle.click();
      await fixture.whenStable();

      expect(component.viewAll()).toBe(true);
      expect(toggle.textContent).toContain('all maps');
      expect(renderedTitles()).toEqual(['Strat 1', 'Strat old']);
    });

    it('orders the rendered list by votes or by date', async () => {
      const up = (userId: string) => ({ vote: VoteDirection.Up, userId });
      strategiesService['_strategies'].set([
        strat('old-popular', { lastUpdated: new Date(2020, 0, 1), votes: [up('a'), up('b')] }),
        strat('new-unpopular', { lastUpdated: new Date(2024, 0, 1), votes: [{ vote: VoteDirection.Down, userId: 'a' }] }),
        strat('mid', { lastUpdated: new Date(2022, 0, 1), votes: [up('a')] })
      ]);
      await fixture.whenStable();
      expect(renderedTitles()).toEqual(['Strat old-popular', 'Strat mid', 'Strat new-unpopular']);

      component.order.set(StratOrderBy.MostRecent);
      await fixture.whenStable();
      expect(renderedTitles()).toEqual(['Strat new-unpopular', 'Strat mid', 'Strat old-popular']);
    });

    it('opens the login when a logged out user votes', () => {
      const openLogin = vi.spyOn(loginService, 'emitOpenLogin');
      const vote = vi.spyOn(strategiesService, 'submitStratVote');

      const upvote = fixture.nativeElement.querySelector('igx-icon[title="vote up"]').closest('button') as HTMLButtonElement;
      upvote.click();

      expect(openLogin).toHaveBeenCalled();
      expect(vote).not.toHaveBeenCalled();
    });

    it('submits the vote and swaps the updated strategy into the list when logged in', async () => {
      user.set({ id: 'user-1' } as ApplicationUser);
      const target = component.strats()[1];
      const updated = strat('2', { map: CSGOMap.Mirage, votes: [{ vote: VoteDirection.Down, userId: 'user-1' }] });
      const vote = vi.spyOn(strategiesService, 'submitStratVote').mockReturnValue(of(updated));

      component.voteStrat(target, VoteDirection.Down);
      await fixture.whenStable();

      expect(vote).toHaveBeenCalledWith(target, VoteDirection.Down, 'user-1');
      expect(component.strats()[0].id).toBe('1');
      expect(component.strats()[1]).toBe(updated);
    });

    it('offers only sharing to users who neither own the strategy nor edit for the team', async () => {
      expect(await openActions()).toEqual(['Share']);
    });

    it('offers edit and delete actions to the strategy owner', async () => {
      user.set({ id: 'owner' } as ApplicationUser);
      strategiesService['_strategies'].set([strat('1', { userId: 'owner' })]);
      await fixture.whenStable();

      expect(await openActions()).toEqual(['Share', 'Edit', 'Delete']);
    });

    it('opens the login from create new strategy when logged out', () => {
      const openLogin = vi.spyOn(loginService, 'emitOpenLogin');
      const createButton = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
        .find(b => b.textContent.includes('Create new strategy'));

      createButton.click();

      expect(openLogin).toHaveBeenCalled();
    });

    it('removes a strategy from the list once it is deleted', async () => {
      const target = component.strats()[0];
      const del = vi.spyOn(strategiesService, 'deleteStrategy').mockReturnValue(of(undefined));

      component.deleteStrat(target);
      await fixture.whenStable();

      expect(del).toHaveBeenCalledWith('1');
      expect(component.strats().map(s => s.id)).toEqual(['2']);
      expect(renderedTitles()).toEqual(['Strat 2']);
    });

    it('keeps a strategy and handles the error when the delete fails', async () => {
      const unhandled = vi.fn();
      config.onUnhandledError = unhandled;
      const target = component.strats()[0];
      vi.spyOn(strategiesService, 'deleteStrategy').mockReturnValue(throwError(() => new Error('delete failed')));

      component.deleteStrat(target);
      await fixture.whenStable();
      // RxJS reports unhandled errors from a timer, so give it one macrotask
      await new Promise(resolve => setTimeout(resolve));
      config.onUnhandledError = null;

      expect(unhandled).not.toHaveBeenCalled();
      expect(component.strats().map(s => s.id)).toEqual(['1', '2']);
    });

    it('appends a newly added strategy', async () => {
      component.onStrategyAdded(strat('new'));
      await fixture.whenStable();

      expect(component.strats().map(s => s.id)).toEqual(['1', '2', 'new']);
      expect(renderedTitles()).toContain('Strat new');
    });

    it('shares a strategy on twitter', () => {
      const socialMedia = TestBed.inject(SocialMediaStrategyService);
      const share = vi.spyOn(socialMedia, 'shareOnTwitter').mockImplementation(() => undefined);

      component.shareOnTwitter(component.strats()[0]);

      expect(share).toHaveBeenCalledWith(component.strats()[0]);
    });
  });

  describe('when the strategy list starts out empty', () => {
    it('appends an added strategy to an undefined list', async () => {
      const empty = signal<CSGOStrategy []>(undefined);
      Object.defineProperty(strategiesService, 'strategies', { get: () => empty });
      await create();

      component.onStrategyAdded(strat('first'));

      expect(component.strats().map(s => s.id)).toEqual(['first']);
    });
  });

  describe('search results', () => {
    beforeEach(async () => {
      vi.spyOn(searchService, 'searchStrategies').mockImplementation(() => {
        searchService['_loadingSearch'].set(true);
      });
      params$.next({ query: 'smoke' });
      await create();
    });

    it('searches for the query and mirrors the loading state', () => {
      expect(searchService.searchStrategies).toHaveBeenCalledWith('smoke');
      expect(component.loading()).toBe(true);
      expect(fixture.nativeElement.querySelector('bg-loading')).toBeTruthy();
      expect(fixture.nativeElement.textContent).not.toContain('No strategies found...');
    });

    it('renders the search results once they arrive', async () => {
      searchService['_strategySearchResult'].set([strat('found')]);
      searchService['_loadingSearch'].set(false);
      await fixture.whenStable();

      expect(component.loading()).toBe(false);
      expect(renderedTitles()).toEqual(['Strat found']);
      expect(strategiesService.loadStrategiesPage).not.toHaveBeenCalled();
    });
  });

  describe('team strategies', () => {
    let team: WritableSignal<CSGOTeam>;

    beforeEach(async () => {
      team = signal<CSGOTeam>(null);
      vi.spyOn(apiService, 'getTeam').mockReturnValue(team.asReadonly());
      vi.spyOn(strategiesService, 'getTeamStrats').mockReturnValue(of([strat('team-1', { teamId: 'team-a' })]));
      vi.spyOn(loginService, 'getUserIsTeamEditor').mockReturnValue(of(true));
      parentParams$.next({ teamid: 'team-a' });
      await create();
    });

    it('waits for the team before loading its strategies', () => {
      expect(apiService.getTeam).toHaveBeenCalledWith('team-a');
      expect(strategiesService.getTeamStrats).not.toHaveBeenCalled();
      expect(component.team()).toBeUndefined();
    });

    it('loads the team strategies and editor rights once the team resolves', async () => {
      team.set({ teamId: 'team-a', teamName: 'Team A' } as CSGOTeam);
      await fixture.whenStable();

      expect(component.team().teamId).toBe('team-a');
      expect(strategiesService.getTeamStrats).toHaveBeenCalledWith('team-a');
      expect(loginService.getUserIsTeamEditor).toHaveBeenCalledWith('team-a');
      expect(component.isEditor()).toBe(true);
      expect(component.loading()).toBe(false);
      expect(component.strats().map(s => s.id)).toEqual(['team-1']);
      expect(renderedTitles()).toEqual(['Strat team-1']);
    });

    it('offers edit and delete actions to team editors', async () => {
      team.set({ teamId: 'team-a', teamName: 'Team A' } as CSGOTeam);
      await fixture.whenStable();

      expect(await openActions()).toEqual(['Share', 'Edit', 'Delete']);
    });

    it('does not use the public or search sources', () => {
      expect(strategiesService.loadStrategiesPage).not.toHaveBeenCalled();
    });
  });

  describe('user strategies', () => {
    beforeEach(() => {
      url$.next([new UrlSegment('user', {})]);
    });

    it('does not load anything until a user is logged in', async () => {
      const userStrats = vi.spyOn(strategiesService, 'getUserStrategies');
      const getTeam = vi.spyOn(apiService, 'getTeam');
      await create();

      expect(userStrats).not.toHaveBeenCalled();
      expect(getTeam).not.toHaveBeenCalled();
      expect(component.strats()).toBeUndefined();
    });

    it('loads the logged in user strategies', async () => {
      const userStrats = vi.spyOn(strategiesService, 'getUserStrategies').mockReturnValue(of([strat('mine', { userId: 'user-1' })]));
      await create();

      user.set({ id: 'user-1' } as ApplicationUser);
      await fixture.whenStable();

      expect(userStrats).toHaveBeenCalledWith('user-1');
      expect(component.strats().map(s => s.id)).toEqual(['mine']);
      expect(renderedTitles()).toEqual(['Strat mine']);
    });

    it('reports an error when the user strategies fail to load', async () => {
      vi.spyOn(strategiesService, 'getUserStrategies').mockReturnValue(throwError(() => new Error('boom')));
      const emitError = vi.spyOn(commService, 'emitError');
      await create();

      user.set({ id: 'user-1' } as ApplicationUser);
      await fixture.whenStable();

      expect(emitError).toHaveBeenCalledWith('boom');
    });
  });
});
