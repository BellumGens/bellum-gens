import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsComponent } from './strategy-details.component';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Meta } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { PLATFORM_ID, Provider, WritableSignal } from '@angular/core';
import { BehaviorSubject, config as rxjsConfig } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import {
  ApiStrategiesService,
  ApplicationUser,
  CSGOMap,
  CSGOStrategy,
  GLOBAL_OVERLAY_SETTINGS,
  LoginService,
  NEW_EMPTY_COMMENT,
  Side,
  SocialMediaStrategyService,
  StrategyComment,
  VoteDirection
} from '../../../../../common/src/public_api';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { environment } from '../../../../../common/src/environments/environment.prod';

const comment = (id: string, overrides: Partial<StrategyComment> = {}): StrategyComment => ({
  id,
  stratId: 'strat-1',
  comment: `Comment ${id}`,
  userId: 'author',
  userAvatar: '',
  ...overrides
});

const strategy = (overrides: Partial<CSGOStrategy> = {}): CSGOStrategy => ({
  id: 'strat-1',
  teamId: null,
  side: Side.TSide,
  title: 'Mid take',
  description: 'Smoke window, flash connector',
  url: '',
  map: CSGOMap.Mirage,
  userId: 'author',
  owner: 'The Author',
  votes: [],
  comments: [],
  ...overrides
});

const user = { id: 'me', csgoDetails: { avatarIcon: 'me.png' } } as ApplicationUser;

describe('StrategyDetailsComponent', () => {
  let component: StrategyDetailsComponent;
  let fixture: ComponentFixture<StrategyDetailsComponent>;
  let params$: BehaviorSubject<Params>;
  let authUser: WritableSignal<ApplicationUser>;
  let authService: LoginService;
  let strategiesService: ApiStrategiesService;
  let smService: SocialMediaStrategyService;
  let httpMock: HttpTestingController;

  const el = (): HTMLElement => fixture.nativeElement;

  const create = async () => {
    fixture = TestBed.createComponent(StrategyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  // Navigates to a strategy and answers the strategy request with the given strategy.
  const loadStrategy = async (strat: CSGOStrategy | null, stratid = strat?.id ?? 'missing') => {
    params$.next({ stratid });
    httpMock.expectOne(r => r.method === 'GET' && r.url.endsWith(`/strategy/strat?stratId=${stratid}`)).flush(strat);
    await fixture.whenStable();
  };

  const button = (label: string): HTMLButtonElement =>
    Array.from<HTMLElement>(el().querySelectorAll('igx-icon'))
      .find(i => i.getAttribute('title') === label || i.textContent.trim() === label)
      .closest('button');

  const textarea = (): HTMLTextAreaElement => el().querySelector('textarea#comment');

  const typeComment = async (text: string) => {
    const box = textarea();
    box.value = text;
    box.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  // The list item of the comment at the given index (the first list item is the "Comments" header).
  const commentItem = (index: number): HTMLElement => el().querySelectorAll<HTMLElement>('igx-list-item')[index + 1];

  const actionsButton = (index: number): HTMLButtonElement => commentItem(index).querySelector('button');

  // Opens the actions drop-down of the comment at the given index and clicks the item with the given label.
  const commentAction = async (index: number, label: string) => {
    actionsButton(index).click();
    await fixture.whenStable();
    const dropDown = commentItem(index).querySelector('igx-drop-down');
    const item = Array.from<HTMLElement>(dropDown.querySelectorAll('igx-drop-down-item'))
      .find(i => i.querySelector('.dd-item-content span').textContent.trim() === label);
    item.click();
    await fixture.whenStable();
  };

  const configure = async (providers: Provider [] = []) => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        StrategyDetailsComponent
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: params$, data: new BehaviorSubject({}) } },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...providers
      ]
    })
    .compileComponents();

    authService = TestBed.inject(LoginService);
    strategiesService = TestBed.inject(ApiStrategiesService);
    smService = TestBed.inject(SocialMediaStrategyService);
    httpMock = TestBed.inject(HttpTestingController);

    // Pretend the logged in user check is already running, so reading the user doesn't hit the network.
    authService['_userCheckInProgress'].set(true);
    authUser = authService['_applicationUser'];
  };

  beforeEach(() => {
    params$ = new BehaviorSubject<Params>({});
  });

  afterEach(() => {
    httpMock?.verify();
    fixture?.destroy();
    fixture = undefined;
    vi.restoreAllMocks();
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await configure();
    });

    it('shows the loading indicator and requests nothing without a strategy id', async () => {
      await create();

      expect(component.strat()).toBeNull();
      expect(component.newComment()).toEqual(NEW_EMPTY_COMMENT);
      expect(component.overlaySettings).toEqual(GLOBAL_OVERLAY_SETTINGS);
      expect(el().querySelector('bg-loading')).toBeTruthy();
      expect(el().querySelector('igx-card')).toBeNull();
      httpMock.expectNone(r => r.url.includes('/strategy/strat'));
    });

    it('updates the share image tags and renders the loaded strategy', async () => {
      const meta = TestBed.inject(Meta);
      vi.spyOn(meta, 'updateTag');
      await create();

      await loadStrategy(strategy({ lastUpdated: new Date(2024, 0, 15) }));

      const image = `${environment.rootApiEndpoint}/Content/Strats/strat-1.png`;
      expect(meta.updateTag).toHaveBeenCalledWith({ name: 'og:image', content: image });
      expect(meta.updateTag).toHaveBeenCalledWith({ name: 'twitter:image', content: image });
      expect(component.strat().id).toBe('strat-1');
      expect(el().querySelector('bg-loading')).toBeNull();
      expect(el().querySelector('h1').textContent).toBe('Mid take');
      expect(el().querySelector('h3[igxCardHeaderSubtitle]').textContent).toBe('Smoke window, flash connector');
      const author = el().querySelector('.card-smaller-subtitle a') as HTMLAnchorElement;
      expect(author.textContent).toBe('The Author');
      expect(author.getAttribute('href')).toBe('/players/author');
      expect(el().querySelector('.card-smaller-subtitle').textContent).toContain('Last Edit: Jan 15, 2024');
      expect(el().querySelector('iframe')).toBeNull();
      expect(el().querySelector('.strategy-image-container')).toBeNull();
    });

    it('keeps loading while the strategy is not available', async () => {
      await create();

      await loadStrategy(null, 'missing');

      expect(component.strat()).toBeNull();
      expect(el().querySelector('bg-loading')).toBeTruthy();
    });

    it('omits the author link for strategies without an owner', async () => {
      await create();

      await loadStrategy(strategy({ userId: null, owner: null }));

      expect(el().querySelector('.card-smaller-subtitle a')).toBeNull();
      expect(el().querySelector('.card-smaller-subtitle').textContent).toContain('Last Edit');
    });

    it('embeds video strategies', async () => {
      await create();

      await loadStrategy(strategy({ url: 'https://www.youtube.com/embed/abc123', stratImage: 'ignored.png' }));

      const iframe = el().querySelector('iframe');
      expect(iframe.getAttribute('src')).toBe('https://www.youtube.com/embed/abc123');
      expect(el().querySelector('.strategy-image-container')).toBeNull();
    });

    it('shows the strategy image when there is no video', async () => {
      await create();

      await loadStrategy(strategy({ stratImage: 'https://example.com/strat.png' }));

      const img = el().querySelector('.strategy-image-container img') as HTMLImageElement;
      expect(img.getAttribute('alt')).toBe('Mid take');
      expect(img.src).toContain('strat.png');
      expect(el().querySelector('iframe')).toBeNull();
    });

    it('renders the vote counts only for directions with votes', async () => {
      await create();

      await loadStrategy(strategy({ votes: [{ userId: 'a', vote: VoteDirection.Up }, { userId: 'b', vote: VoteDirection.Up }] }));

      expect(button('vote up').querySelector('span').textContent.trim()).toBe('2');
      expect(button('vote down').querySelector('span')).toBeNull();
    });

    it('shares the strategy on twitter', async () => {
      vi.spyOn(smService, 'shareOnTwitter').mockImplementation(() => undefined);
      await create();
      await loadStrategy(strategy());

      button('Share Strategy').click();

      expect(smService.shareOnTwitter).toHaveBeenCalledWith(component.strat());
    });

    it('tracks the window width', async () => {
      const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
      await create();
      await loadStrategy(strategy());

      expect(matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
      expect(component.horizontal()).toBe(false);
      expect(el().querySelector('igx-divider').classList).not.toContain('igx-divider--vertical');

      matchMedia.mockReturnValue({ matches: true } as MediaQueryList);
      window.dispatchEvent(new Event('resize'));
      await fixture.whenStable();

      expect(component.horizontal()).toBe(true);
      expect(el().querySelector('igx-divider').classList).toContain('igx-divider--vertical');
    });

    it('keeps the comment draft while the same strategy refreshes, but retargets it for another strategy', async () => {
      await create();
      await loadStrategy(strategy());
      expect(component.newComment().stratId).toBe('strat-1');

      component.newComment.update(c => ({ ...c, comment: 'draft' }));
      const draft = component.newComment();
      // Refresh the cached strategy, as a vote or comment from elsewhere would.
      strategiesService['_strategyCache'].get('strat-1').set(strategy({ title: 'Refreshed' }));
      await fixture.whenStable();

      expect(el().querySelector('h1').textContent).toBe('Refreshed');
      expect(component.newComment()).toBe(draft);

      await loadStrategy(strategy({ id: 'strat-2', title: 'Long A' }));

      expect(el().querySelector('h1').textContent).toBe('Long A');
      expect(component.newComment()).toEqual({ ...NEW_EMPTY_COMMENT, comment: 'draft', stratId: 'strat-2' });
    });

    describe('logged out', () => {
      beforeEach(async () => {
        await create();
        await loadStrategy(strategy({ votes: [{ userId: 'me', vote: VoteDirection.Up }] }));
      });

      it('asks to log in before commenting', () => {
        expect(textarea().disabled).toBe(true);
        expect(el().querySelector('label[for="comment"]').textContent).toContain('Login to comment...');
        expect(component.newComment().userId).toBeNull();
        expect(el().querySelector('.comment-box igx-avatar')).toBeTruthy();
        expect(button('vote up').className).not.toContain('user-has-voted');
      });

      it('shows no comment actions', async () => {
        await loadStrategy(strategy({ id: 'strat-3', comments: [comment('c1'), comment('c2', { userId: 'me' })] }));

        expect(el().querySelectorAll('h3[igxListLineTitle]').length).toBe(2);
        expect(el().querySelector('igx-list-item button')).toBeNull();
        expect(el().querySelector('igx-list-item igx-drop-down')).toBeNull();
      });

      it('opens the login instead of voting', () => {
        const openLoginSpy = vi.fn();
        const sub = authService.openLogin.subscribe(openLoginSpy);

        button('vote up').click();
        button('vote down').click();

        expect(openLoginSpy).toHaveBeenCalledTimes(2);
        httpMock.expectNone(r => r.url.includes('/strategy/vote'));
        sub.unsubscribe();
      });
    });

    describe('logged in', () => {
      let unhandledError: ReturnType<typeof vi.fn<(err: unknown) => void>>;

      // Lets rxjs report errors that no subscriber handled.
      const flushUnhandledErrors = () => new Promise(resolve => setTimeout(resolve));

      const failRequest = (method: string, url: string) =>
        httpMock.expectOne(r => r.method === method && r.url.endsWith(url))
          .flush('Server error', { status: 500, statusText: 'Server Error' });

      afterEach(() => {
        rxjsConfig.onUnhandledError = null;
      });

      beforeEach(async () => {
        unhandledError = vi.fn<(err: unknown) => void>();
        rxjsConfig.onUnhandledError = unhandledError;
        authUser.set(user);
        await create();
        await loadStrategy(strategy({
          votes: [{ userId: 'me', vote: VoteDirection.Down }],
          comments: [comment('c1'), comment('c2', { userId: 'me' })]
        }));
      });

      it('assigns the user to the comment draft and enables commenting', () => {
        expect(component.newComment()).toEqual({ userId: 'me', stratId: 'strat-1', comment: null });
        expect(textarea().disabled).toBe(false);
        expect(el().querySelector('label[for="comment"]').textContent).toContain('Leave a comment...');
        expect(button('vote down').className).toContain('user-has-voted');
        expect(button('vote up').className).not.toContain('user-has-voted');
      });

      it('lists the comments', () => {
        const titles = Array.from<HTMLElement>(el().querySelectorAll('h3[igxListLineTitle]')).map(h => h.textContent);
        expect(titles).toEqual(['Comment c1', 'Comment c2']);
      });

      it('shows the comment actions only on the comments of the user', () => {
        expect(actionsButton(0)).toBeNull();
        expect(commentItem(0).querySelector('igx-drop-down')).toBeNull();

        const actions = actionsButton(1);
        expect(actions.type).toBe('button');
        expect(actions.getAttribute('aria-label')).toBe('Comment actions');
        expect(actions.getAttribute('aria-haspopup')).toBe('listbox');
        expect(actions.getAttribute('aria-expanded')).toBe('false');
        expect(actions.closest('[igxListAction]')).toBeTruthy();
      });

      it('hides the comment actions when the user logs out', async () => {
        authUser.set(null);
        await fixture.whenStable();

        expect(el().querySelector('igx-list-item button')).toBeNull();
      });

      it('marks the comment actions as expanded while open', async () => {
        actionsButton(1).click();
        await fixture.whenStable();

        expect(actionsButton(1).getAttribute('aria-expanded')).toBe('true');

        actionsButton(1).click();
        await fixture.whenStable();

        expect(actionsButton(1).getAttribute('aria-expanded')).toBe('false');
      });

      it('edits a comment with the keyboard', async () => {
        const actions = actionsButton(1);
        actions.click();
        await fixture.whenStable();

        actions.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        actions.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await fixture.whenStable();

        expect(component.editedCommentId()).toBe('c2');
        expect(document.activeElement).toBe(textarea());
      });

      it('assigns a user that logs in later to the comment draft', async () => {
        authUser.set({ ...user, id: 'other' });
        TestBed.tick();

        expect(component.newComment().userId).toBe('other');
      });

      it('submits a vote and shows the updated strategy', async () => {
        button('vote up').click();

        const req = httpMock.expectOne(r => r.method === 'POST' && r.url.endsWith('/strategy/vote'));
        expect(req.request.body).toEqual({ id: 'strat-1', direction: VoteDirection.Up });
        req.flush({ userId: 'me', vote: VoteDirection.Up });
        await fixture.whenStable();

        expect(component.strat().votes).toEqual([{ userId: 'me', vote: VoteDirection.Up }]);
        expect(button('vote up').className).toContain('user-has-voted');
        expect(button('vote up').querySelector('span').textContent.trim()).toBe('1');
        expect(button('vote down').querySelector('span')).toBeNull();
      });

      it('submits a new comment through the form and resets the draft', async () => {
        const send = button('send');
        expect(send.disabled).toBe(true);

        await typeComment('Nice smokes');
        expect(component.newComment().comment).toBe('Nice smokes');
        expect(send.disabled).toBe(false);

        el().querySelector('form').dispatchEvent(new Event('submit'));
        const req = httpMock.expectOne(r => r.method === 'POST' && r.url.endsWith('/strategy/comment'));
        expect(req.request.body).toEqual({ userId: 'me', stratId: 'strat-1', comment: 'Nice smokes' });
        req.flush(comment('c3', { comment: 'Nice smokes', userId: 'me' }));
        await fixture.whenStable();

        expect(component.strat().comments.map(c => c.id)).toEqual(['c1', 'c2', 'c3']);
        expect(el().querySelectorAll('h3[igxListLineTitle]')[2].textContent).toBe('Nice smokes');
        expect(component.newComment()).toEqual({ userId: 'me', stratId: 'strat-1', comment: null });
        expect(textarea().value).toBe('');
        expect(send.disabled).toBe(true);
      });

      it('does not style the send button as a vote', () => {
        expect(button('vote down').className).toContain('user-has-voted');
        expect(button('send').className).not.toContain('user-has-voted');
      });

      it('keeps the strategy when a vote fails', async () => {
        const before = component.strat();
        button('vote up').click();

        failRequest('POST', '/strategy/vote');
        await fixture.whenStable();
        await flushUnhandledErrors();

        expect(unhandledError).not.toHaveBeenCalled();
        expect(component.strat()).toBe(before);
      });

      it('edits a copy of a listed comment and applies it once saved', async () => {
        await commentAction(1, 'Edit');

        const listed = component.strat().comments[1];
        expect(component.newComment()).not.toBe(listed);
        expect(component.newComment()).toEqual(listed);
        expect(component.editedCommentId()).toBe('c2');
        expect(textarea().value).toBe('Comment c2');
        expect(document.activeElement).toBe(textarea());
        expect(el().querySelectorAll('h3[igxListLineTitle]')[1].classList).toContain('comment-editing');

        await typeComment('Updated');

        // The listed comment is untouched until the edit is saved.
        expect(listed.comment).toBe('Comment c2');
        expect(el().querySelectorAll('h3[igxListLineTitle]')[1].textContent).toBe('Comment c2');

        el().querySelector('form').dispatchEvent(new Event('submit'));
        const req = httpMock.expectOne(r => r.method === 'POST' && r.url.endsWith('/strategy/comment'));
        expect(req.request.body).toEqual({ ...listed, comment: 'Updated' });
        expect('_inEdit' in req.request.body).toBe(false);
        req.flush(comment('c2', { comment: 'Updated', userId: 'me' }));
        await fixture.whenStable();

        expect(component.strat().comments.map(c => c.comment)).toEqual(['Comment c1', 'Updated']);
        expect(el().querySelectorAll('h3[igxListLineTitle]')[1].classList).not.toContain('comment-editing');
        expect(component.editedCommentId()).toBeNull();
        expect(component.newComment()).toEqual({ userId: 'me', stratId: 'strat-1', comment: null });
      });

      it('keeps the edit when saving it fails', async () => {
        await commentAction(1, 'Edit');
        await typeComment('Updated');

        el().querySelector('form').dispatchEvent(new Event('submit'));
        failRequest('POST', '/strategy/comment');
        await fixture.whenStable();
        await flushUnhandledErrors();

        expect(unhandledError).not.toHaveBeenCalled();
        expect(component.strat().comments[1].comment).toBe('Comment c2');
        expect(el().querySelectorAll('h3[igxListLineTitle]')[1].textContent).toBe('Comment c2');
        expect(el().querySelectorAll('h3[igxListLineTitle]')[1].classList).toContain('comment-editing');
        expect(component.editedCommentId()).toBe('c2');
        expect(textarea().value).toBe('Updated');
      });

      it('keeps a new comment draft when submitting it fails', async () => {
        await typeComment('Nice smokes');

        el().querySelector('form').dispatchEvent(new Event('submit'));
        failRequest('POST', '/strategy/comment');
        await fixture.whenStable();
        await flushUnhandledErrors();

        expect(unhandledError).not.toHaveBeenCalled();
        expect(component.strat().comments.length).toBe(2);
        expect(component.newComment().comment).toBe('Nice smokes');
        expect(textarea().value).toBe('Nice smokes');
      });

      it('cancels an edit', async () => {
        const cancel = () => Array.from<HTMLButtonElement>(el().querySelectorAll('form button'))
          .find(b => b.textContent.trim() === 'Cancel edit');
        expect(cancel()).toBeUndefined();

        await commentAction(1, 'Edit');
        await typeComment('Updated');
        expect(cancel().type).toBe('button');

        cancel().click();
        await fixture.whenStable();

        httpMock.expectNone(r => r.url.includes('/strategy/comment'));
        expect(component.editedCommentId()).toBeNull();
        expect(component.newComment()).toEqual({ userId: 'me', stratId: 'strat-1', comment: null });
        expect(component.strat().comments[1].comment).toBe('Comment c2');
        expect(el().querySelectorAll('h3[igxListLineTitle]')[1].classList).not.toContain('comment-editing');
        expect(textarea().value).toBe('');
        expect(document.activeElement).toBe(textarea());
        expect(cancel()).toBeUndefined();
      });

      it('drops the edit when the edited comment is deleted', async () => {
        await commentAction(1, 'Edit');

        component.deleteComment(component.strat().comments[1]);
        httpMock.expectOne(r => r.method === 'DELETE' && r.url.endsWith('/strategy/comment?id=c2')).flush(null);
        await fixture.whenStable();

        expect(component.strat().comments.map(c => c.id)).toEqual(['c1']);
        expect(component.editedCommentId()).toBeNull();
        expect(component.newComment()).toEqual({ userId: 'me', stratId: 'strat-1', comment: null });
      });

      it('drops the edit when another strategy loads', async () => {
        await commentAction(1, 'Edit');

        await loadStrategy(strategy({ id: 'strat-2', title: 'Long A' }));

        expect(component.editedCommentId()).toBeNull();
        expect(component.newComment()).toEqual({ userId: 'me', stratId: 'strat-2', comment: null });
      });

      it('keeps the comment when deleting it fails', async () => {
        component.deleteComment(component.strat().comments[0]);
        failRequest('DELETE', '/strategy/comment?id=c1');
        await fixture.whenStable();
        await flushUnhandledErrors();

        expect(unhandledError).not.toHaveBeenCalled();
        expect(component.strat().comments.map(c => c.id)).toEqual(['c1', 'c2']);
      });

      it('deletes a comment after confirmation', async () => {
        const confirm = fixture.debugElement.query(By.directive(ConfirmComponent)).componentInstance as ConfirmComponent;
        vi.spyOn(confirm, 'open');

        await commentAction(1, 'Delete');
        const target = component.strat().comments[1];
        expect(confirm.open).toHaveBeenCalledWith(target);
        expect(component.editedCommentId()).toBeNull();

        confirm.okClicked();
        const req = httpMock.expectOne(r => r.method === 'DELETE' && r.url.endsWith('/strategy/comment?id=c2'));
        req.flush(null);
        await fixture.whenStable();

        expect(component.strat().comments.map(c => c.id)).toEqual(['c1']);
        expect(el().querySelectorAll('h3[igxListLineTitle]').length).toBe(1);
      });
    });
  });

  describe('on the server', () => {
    beforeEach(async () => {
      await configure([{ provide: PLATFORM_ID, useValue: 'server' }]);
    });

    it('does not query the window size', async () => {
      const matchMedia = vi.spyOn(window, 'matchMedia');
      await create();

      component.resize();

      expect(matchMedia).not.toHaveBeenCalled();
      expect(component.horizontal()).toBe(true);
    });
  });
});
