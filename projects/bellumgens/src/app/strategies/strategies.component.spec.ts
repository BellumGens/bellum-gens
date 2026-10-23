import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategiesComponent } from './strategies.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute, Params, provideRouter, UrlSegment } from '@angular/router';
import { BehaviorSubject, config, of, throwError } from 'rxjs';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
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
import { ConfirmComponent } from '../../../../common/src/lib/confirm/confirm.component';
import { NewStrategyComponent } from './new-strategy/new-strategy.component';

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

  const actionsButtons = (): HTMLButtonElement [] =>
    Array.from(fixture.nativeElement.querySelectorAll('button[aria-label="Strategy actions"]'));

  // Opens the actions drop-down of the first card and returns its item labels.
  const openActions = async (): Promise<string []> => {
    actionsButtons()[0].click();
    await fixture.whenStable();

    return Array.from<HTMLElement>(document.querySelectorAll('igx-drop-down-item .dd-item-content span'))
      .map(i => i.textContent.trim());
  };

  // Clicks the item with the given label in the open actions drop-down.
  const selectAction = async (label: string) => {
    Array.from<HTMLElement>(document.querySelectorAll('igx-drop-down-item'))
      .find(i => i.querySelector('.dd-item-content span').textContent.trim() === label)
      .click();
    await fixture.whenStable();
  };

  const loadMoreButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button.load-more-button');

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
      const loadMore = loadMoreButton();
      expect(loadMore.type).toBe('button');
      expect(loadMore.getAttribute('aria-label')).toBe('Load More...');
      expect(loadMore.querySelector('igx-avatar[icon="sync"]').getAttribute('aria-hidden')).toBe('true');

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

      expect(loadMoreButton()).toBeNull();
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

    it('opens the new strategy dialog from create new strategy when logged in', async () => {
      user.set({ id: 'user-1' } as ApplicationUser);
      await fixture.whenStable();
      const newStrategy = fixture.debugElement.query(By.directive(NewStrategyComponent)).componentInstance as NewStrategyComponent;
      const open = vi.spyOn(newStrategy, 'open').mockImplementation(() => undefined);
      const openLogin = vi.spyOn(loginService, 'emitOpenLogin');

      Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
        .find(b => b.textContent.includes('Create new strategy'))
        .click();

      expect(open).toHaveBeenCalled();
      expect(openLogin).not.toHaveBeenCalled();
    });

    it('links the author of a strategy to their profile', async () => {
      strategiesService['_strategies'].set([strat('1', { owner: 'kdinev', userId: 'user-1' })]);
      await fixture.whenStable();

      const author = fixture.nativeElement.querySelector('h4[igxCardHeaderSubtitle] a') as HTMLAnchorElement;
      expect(author.textContent).toBe('kdinev');
      expect(author.getAttribute('href')).toBe('/players/user-1');
    });

    it('votes a strategy down from its button', async () => {
      user.set({ id: 'user-1' } as ApplicationUser);
      const target = component.strats()[0];
      const vote = vi.spyOn(strategiesService, 'submitStratVote').mockReturnValue(of(target));

      (fixture.nativeElement.querySelector('igx-icon[title="vote down"]').closest('button') as HTMLButtonElement).click();

      expect(vote).toHaveBeenCalledWith(target, VoteDirection.Down, 'user-1');
    });

    it('changes the order from the order by select', async () => {
      fixture.debugElement.query(By.css('igx-select.order-by')).triggerEventHandler('ngModelChange', StratOrderBy.MostRecent);
      await fixture.whenStable();

      expect(component.order()).toBe(StratOrderBy.MostRecent);
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

    it('renders the strategy actions as named menu buttons', async () => {
      const buttons = actionsButtons();
      expect(buttons.length).toBe(2);
      for (const button of buttons) {
        expect(button.type).toBe('button');
        expect(button.getAttribute('aria-haspopup')).toBe('listbox');
        expect(button.getAttribute('aria-expanded')).toBe('false');
      }

      await openActions();

      expect(actionsButtons()[0].getAttribute('aria-expanded')).toBe('true');
      expect(actionsButtons()[1].getAttribute('aria-expanded')).toBe('false');
    });

    it('shares a strategy from the actions drop-down', async () => {
      const share = vi.spyOn(TestBed.inject(SocialMediaStrategyService), 'shareOnTwitter').mockImplementation(() => undefined);

      await openActions();
      await selectAction('Share');

      expect(share).toHaveBeenCalledWith(component.strats()[0]);
    });

    it('edits and deletes a strategy from the actions drop-down', async () => {
      user.set({ id: 'owner' } as ApplicationUser);
      strategiesService['_strategies'].set([strat('1', { userId: 'owner' })]);
      await fixture.whenStable();
      const newStrategy = fixture.debugElement.query(By.directive(NewStrategyComponent)).componentInstance as NewStrategyComponent;
      const confirm = fixture.debugElement.query(By.directive(ConfirmComponent)).componentInstance as ConfirmComponent;
      const edit = vi.spyOn(newStrategy, 'open').mockImplementation(() => undefined);
      const del = vi.spyOn(confirm, 'open').mockImplementation(() => undefined);

      await openActions();
      await selectAction('Edit');
      expect(edit).toHaveBeenCalledWith(component.strats()[0], 'Edit strategy');

      await openActions();
      await selectAction('Delete');
      expect(del).toHaveBeenCalledWith(component.strats()[0]);
    });

    it('runs a strategy action with the keyboard', async () => {
      user.set({ id: 'owner' } as ApplicationUser);
      strategiesService['_strategies'].set([strat('1', { userId: 'owner' })]);
      await fixture.whenStable();
      const newStrategy = fixture.debugElement.query(By.directive(NewStrategyComponent)).componentInstance as NewStrategyComponent;
      const edit = vi.spyOn(newStrategy, 'open').mockImplementation(() => undefined);

      await openActions();
      const button = actionsButtons()[0];
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await fixture.whenStable();

      expect(edit).toHaveBeenCalledWith(component.strats()[0], 'Edit strategy');
    });

    it('links the title, image and comments of a strategy to its details', async () => {
      strategiesService['_strategies'].set([strat('1', { stratImage: '/strat-1.png', comments: [] })]);
      await fixture.whenStable();

      const title = fixture.nativeElement.querySelector('h2.strat-title a') as HTMLAnchorElement;
      expect(title.getAttribute('href')).toBe('/strategies/details/strat-1');
      expect(title.textContent.trim()).toBe('Strat 1');

      // The image repeats the title link, so it is kept out of the tab order and the accessibility tree.
      const image = fixture.nativeElement.querySelector('img.strat-image') as HTMLImageElement;
      const imageLink = image.closest('a');
      expect(imageLink.getAttribute('href')).toBe('/strategies/details/strat-1');
      expect(imageLink.getAttribute('tabindex')).toBe('-1');
      expect(imageLink.getAttribute('aria-hidden')).toBe('true');
      expect(image.getAttribute('alt')).toBe('');

      const comments = fixture.nativeElement.querySelector('a.comments-link') as HTMLAnchorElement;
      expect(comments.getAttribute('href')).toBe('/strategies/details/strat-1');
      expect(comments.getAttribute('aria-label')).toBe('Comments: 0');
      expect(comments.querySelector('igx-badge').getAttribute('aria-hidden')).toBe('true');
    });

    it('names the media container by its content instead of exposing an unnamed img role around links', async () => {
      strategiesService['_strategies'].set([strat('1', { stratImage: '/strat-1.png' })]);
      await fixture.whenStable();

      const media = fixture.nativeElement.querySelector('igx-card-media') as HTMLElement;
      expect(media.getAttribute('role')).toBe('none');
      expect(media.querySelector('a')).toBeTruthy();
    });

    it('titles the video frame of a strategy with the strategy title', async () => {
      strategiesService['_strategies'].set([strat('1', { url: 'https://www.youtube.com/embed/abc' })]);
      await fixture.whenStable();

      const frame = fixture.nativeElement.querySelector('igx-card-media iframe') as HTMLIFrameElement;
      expect(frame.getAttribute('title')).toBe('Strat 1');
    });

    it('drops a strategy image that fails to load instead of showing it broken', async () => {
      strategiesService['_strategies'].set([strat('1', { stratImage: '/missing.png' }), strat('2', { stratImage: '/strat-2.png' })]);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelectorAll('img.strat-image').length).toBe(2);

      fixture.nativeElement.querySelector('img.strat-image').dispatchEvent(new Event('error'));
      await fixture.whenStable();

      const images: HTMLImageElement [] = Array.from(fixture.nativeElement.querySelectorAll('img.strat-image'));
      expect(images.length).toBe(1);
      expect(images[0].getAttribute('src')).toContain('/strat-2.png');
      expect(renderedTitles()).toEqual(['Strat 1', 'Strat 2']);
    });

    it('names the vote buttons with their action and count and marks the user vote as pressed', async () => {
      const voteButtons = (): HTMLButtonElement [] =>
        Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('.strategy-actions button')).slice(0, 2);
      expect(voteButtons().map(b => b.getAttribute('aria-label'))).toEqual(['Vote up: 0', 'Vote down: 0']);
      expect(voteButtons().map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'false']);
      expect(voteButtons().every(b => b.type === 'button')).toBe(true);

      user.set({ id: 'user-1' } as ApplicationUser);
      strategiesService['_strategies'].set([strat('1', { votes: [
        { vote: VoteDirection.Up, userId: 'user-1' },
        { vote: VoteDirection.Up, userId: 'user-2' },
        { vote: VoteDirection.Down, userId: 'user-3' }
      ] })]);
      await fixture.whenStable();

      expect(voteButtons().map(b => b.getAttribute('aria-label'))).toEqual(['Vote up: 2', 'Vote down: 1']);
      expect(voteButtons().map(b => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
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

    it('reports a friendly error, without the request url, when the user strategies fail to load', async () => {
      const url = 'https://api/strategy/userstrats?userid=user-1';
      vi.spyOn(strategiesService, 'getUserStrategies').mockReturnValue(throwError(() =>
        new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error', url })));
      const emitError = vi.spyOn(commService, 'emitError');
      await create();

      user.set({ id: 'user-1' } as ApplicationUser);
      await fixture.whenStable();

      expect(emitError).toHaveBeenCalledTimes(1);
      expect(emitError).toHaveBeenCalledWith('Your strategies could not be loaded. Please try again later.');
      expect(emitError.mock.calls[0][0]).not.toContain(url);
    });
  });
});
