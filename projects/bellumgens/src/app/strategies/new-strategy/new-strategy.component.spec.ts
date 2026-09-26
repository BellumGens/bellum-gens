import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { config, of, throwError } from 'rxjs';

import { NewStrategyComponent } from './new-strategy.component';
import {
  ApiStrategiesService,
  CSGOMap,
  CSGOStrategy,
  CSGOTeam,
  NEW_EMPTY_STRAT,
  Side
} from '../../../../../common/src/public_api';

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const YOUTUBE_EMBED = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
const TWITCH_URL = 'https://www.twitch.tv/videos/123456';
const TWITCH_EMBED = 'https://player.twitch.tv/?autoplay=false&video=v123456';

const team = { teamId: 'team-1', teamName: 'Team One' } as CSGOTeam;

const existingStrategy = (): CSGOStrategy => ({
  id: 'strat-1',
  teamId: 'team-1',
  userId: 'user-1',
  title: 'Existing strat',
  description: 'Existing description',
  url: YOUTUBE_EMBED,
  side: Side.CTSide,
  visible: true,
  map: CSGOMap.Inferno
});

describe('NewStrategyComponent', () => {
  let component: NewStrategyComponent;
  let fixture: ComponentFixture<NewStrategyComponent>;
  let apiService: ApiStrategiesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NewStrategyComponent],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();

    apiService = TestBed.inject(ApiStrategiesService);
    router = TestBed.inject(Router);
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NewStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(async () => {
    if (component.dialog().isOpen) {
      component.dialog().close();
      await fixture.whenStable();
    }
    config.onUnhandledError = null;
  });

  const el = <T extends Element>(selector: string): T | undefined =>
    fixture.debugElement.query(By.css(selector))?.nativeElement as T | undefined;

  const typeInto = async (selector: string, value: string) => {
    const input = el<HTMLInputElement | HTMLTextAreaElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const buttons = () => fixture.debugElement.queryAll(By.css('button')).map(b => b.nativeElement as HTMLButtonElement);
  const editorButton = () => buttons().find(b => b.textContent.includes('Editor'));
  const submitButton = () => buttons().find(b => b.textContent.includes('Submit'));
  const clearButtonFor = (selector: string) =>
    el<HTMLElement>(selector).closest('igx-input-group').querySelector<HTMLElement>('igx-suffix') ?? undefined;
  const iframe = () => el<HTMLIFrameElement>('iframe.video-frame');
  const titleText = () => (fixture.nativeElement as HTMLElement).querySelector('form > span')?.textContent.trim();

  const fillValidForm = async (url = 'https://example.com/strat') => {
    await typeInto('#strategyName', 'Fast B rush');
    await typeInto('#strategyDescription', 'Everyone rushes B through tunnels');
    await typeInto('#strategyUrl', url);
  };

  const openDialog = async (strat?: CSGOStrategy, title?: string) => {
    component.open(strat, title);
    await fixture.whenStable();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('opening', () => {
    it('opens the dialog for a new strategy with the default title', async () => {
      await openDialog();

      expect(component.dialog().isOpen).toBe(true);
      expect(component.title()).toBe('Add a new team strategy');
      expect(titleText()).toBe('Add a new team strategy');
      expect(component.newStrategy()).toEqual({ ...NEW_EMPTY_STRAT, visible: true });
    });

    it('does not mark a new strategy public by default when it belongs to a team', async () => {
      fixture.componentRef.setInput('team', team);
      await fixture.whenStable();

      await openDialog();

      expect(component.newStrategy().visible).toBe(false);
    });

    it('populates the form with an existing strategy and the given title when editing', async () => {
      const strat = existingStrategy();

      await openDialog(strat, 'Edit strategy');

      expect(component.dialog().isOpen).toBe(true);
      expect(titleText()).toBe('Edit strategy');
      expect(component.newStrategy()).toBe(strat);
      expect(el<HTMLInputElement>('#strategyName').value).toBe('Existing strat');
      expect(el<HTMLTextAreaElement>('#strategyDescription').value).toBe('Existing description');
      expect(el<HTMLInputElement>('#strategyUrl').value).toBe(YOUTUBE_EMBED);
      expect(iframe()).toBeTruthy();
    });

    it('falls back to the default title after an edit', async () => {
      await openDialog(existingStrategy(), 'Edit strategy');
      component.dialog().close();
      await fixture.whenStable();

      await openDialog();

      expect(titleText()).toBe('Add a new team strategy');
    });

    it('resets the model to an empty strategy when the dialog closes', async () => {
      await openDialog(existingStrategy(), 'Edit strategy');

      component.dialog().close();
      await fixture.whenStable();

      expect(component.newStrategy()).toEqual({ ...NEW_EMPTY_STRAT, visible: true });
      expect(el<HTMLInputElement>('#strategyName').value).toBe('');
    });

    it('resets to a private strategy when the dialog belongs to a team', async () => {
      fixture.componentRef.setInput('team', team);
      component.resetStrategy();

      expect(component.newStrategy()).toEqual({ ...NEW_EMPTY_STRAT, visible: false });
    });
  });

  describe('form fields', () => {
    beforeEach(async () => {
      await openDialog();
    });

    it('writes typed title and description into the model', async () => {
      await typeInto('#strategyName', 'Fast B rush');
      await typeInto('#strategyDescription', 'Everyone rushes B');

      expect(component.newStrategy().title).toBe('Fast B rush');
      expect(component.newStrategy().description).toBe('Everyone rushes B');
    });

    it('shows a clear button for the title once it has text, and clears it', async () => {
      expect(clearButtonFor('#strategyName')).toBeUndefined();

      await typeInto('#strategyName', 'Fast B rush');
      const clear = clearButtonFor('#strategyName');
      expect(clear).toBeTruthy();

      clear.click();
      await fixture.whenStable();

      expect(component.newStrategy().title).toBeNull();
      expect(el<HTMLInputElement>('#strategyName').value).toBe('');
    });

    it('stores the selected map', async () => {
      const inferno = component.mapList.find(m => m.mapId === CSGOMap.Inferno);
      const item = fixture.debugElement.queryAll(By.css('igx-select-item'))
        .find(i => (i.nativeElement as HTMLElement).textContent.trim() === inferno.map);

      (item.nativeElement as HTMLElement).click();
      await fixture.whenStable();

      expect(component.newStrategy().map).toBe(CSGOMap.Inferno);
      expect(component.selectedMap).toBe(inferno);
    });

    it('lists every active duty map', () => {
      const items = fixture.debugElement.queryAll(By.css('igx-select-item'));
      expect(items.map(i => (i.nativeElement as HTMLElement).textContent.trim()))
        .toEqual(component.mapList.map(m => m.map));
    });
  });

  describe('url', () => {
    beforeEach(async () => {
      await openDialog();
    });

    it('stores the embed link for a YouTube url and shows the video', async () => {
      await typeInto('#strategyUrl', YOUTUBE_URL);

      expect(component.newStrategy().url).toBe(YOUTUBE_EMBED);
      expect(iframe()).toBeTruthy();
      expect(iframe().getAttribute('src')).toBe(YOUTUBE_EMBED);
    });

    it('stores the embed link for a Twitch url and shows the video', async () => {
      await typeInto('#strategyUrl', TWITCH_URL);

      expect(component.newStrategy().url).toBe(TWITCH_EMBED);
      expect(iframe().getAttribute('src')).toBe(TWITCH_EMBED);
    });

    it('stores a non-video url as typed without showing a video', async () => {
      await typeInto('#strategyUrl', 'https://example.com/strat');

      expect(component.newStrategy().url).toBe('https://example.com/strat');
      expect(iframe()).toBeUndefined();
    });

    it('stores an empty url and hides the video when the field is emptied', async () => {
      await typeInto('#strategyUrl', YOUTUBE_URL);
      expect(iframe()).toBeTruthy();

      await typeInto('#strategyUrl', '');

      expect(component.newStrategy().url).toBe('');
      expect(iframe()).toBeUndefined();
    });

    it('clears the url and hides the video from the clear button', async () => {
      await typeInto('#strategyUrl', YOUTUBE_URL);
      expect(clearButtonFor('#strategyUrl')).toBeTruthy();

      clearButtonFor('#strategyUrl').click();
      await fixture.whenStable();

      expect(component.newStrategy().url).toBeNull();
      expect(iframe()).toBeUndefined();
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      await openDialog();
    });

    it('disables both actions while the form is empty', () => {
      expect(editorButton().disabled).toBe(true);
      expect(submitButton().disabled).toBe(true);
    });

    it('enables both actions once the form is valid and has a url', async () => {
      await fillValidForm();

      expect(editorButton().disabled).toBe(false);
      expect(submitButton().disabled).toBe(false);
    });

    it('allows opening the editor without a url, but not submitting', async () => {
      await typeInto('#strategyName', 'Fast B rush');
      await typeInto('#strategyDescription', 'Everyone rushes B');

      expect(editorButton().disabled).toBe(false);
      expect(submitButton().disabled).toBe(true);
    });

    it('keeps the actions disabled for a title shorter than two characters', async () => {
      await fillValidForm();
      await typeInto('#strategyName', 'F');

      expect(editorButton().disabled).toBe(true);
      expect(submitButton().disabled).toBe(true);
    });

    it('keeps the actions disabled for a url that is not a link', async () => {
      await fillValidForm('not a link');

      expect(editorButton().disabled).toBe(true);
      expect(submitButton().disabled).toBe(true);
    });
  });

  describe('submitting', () => {
    const saved = (overrides: Partial<CSGOStrategy> = {}): CSGOStrategy =>
      ({ ...existingStrategy(), id: 'server-id', customUrl: 'fast-b-rush', ...overrides });

    it('submits the new strategy, emits the saved strategy and closes the dialog', async () => {
      const response = saved();
      const submit = vi.spyOn(apiService, 'submitStrategy').mockReturnValue(of(response));
      const added = vi.fn();
      component.strategyAdded.subscribe(added);
      await openDialog();
      await fillValidForm(YOUTUBE_URL);

      submitButton().click();
      await fixture.whenStable();

      expect(submit).toHaveBeenCalledTimes(1);
      expect(submit.mock.calls[0][0]).toEqual({
        ...NEW_EMPTY_STRAT,
        visible: true,
        title: 'Fast B rush',
        description: 'Everyone rushes B through tunnels',
        url: YOUTUBE_EMBED
      });
      expect(added).toHaveBeenCalledWith(response);
      expect(component.dialog().isOpen).toBe(false);
    });

    it('assigns the team to the submitted strategy', async () => {
      fixture.componentRef.setInput('team', team);
      const submit = vi.spyOn(apiService, 'submitStrategy').mockReturnValue(of(saved()));
      await openDialog();
      await fillValidForm();

      submitButton().click();
      await fixture.whenStable();

      expect(submit.mock.calls[0][0]).toEqual(expect.objectContaining({ teamId: 'team-1', visible: false }));
    });

    it('saves an edited strategy without emitting it as a new one', async () => {
      const submit = vi.spyOn(apiService, 'submitStrategy').mockReturnValue(of(saved({ id: 'strat-1' })));
      const added = vi.fn();
      component.strategyAdded.subscribe(added);
      await openDialog(existingStrategy(), 'Edit strategy');
      await typeInto('#strategyName', 'Renamed strat');

      submitButton().click();
      await fixture.whenStable();

      expect(submit.mock.calls[0][0]).toEqual({ ...existingStrategy(), title: 'Renamed strat' });
      expect(added).not.toHaveBeenCalled();
      expect(component.dialog().isOpen).toBe(false);
    });

    it('keeps the dialog open and emits nothing when saving fails', async () => {
      const unhandled = vi.fn();
      config.onUnhandledError = unhandled;
      vi.spyOn(apiService, 'submitStrategy').mockReturnValue(throwError(() => new Error('save failed')));
      const added = vi.fn();
      component.strategyAdded.subscribe(added);
      await openDialog();
      await fillValidForm();

      submitButton().click();
      await fixture.whenStable();
      // RxJS reports unhandled errors from a timer, so give it one macrotask
      await new Promise(resolve => setTimeout(resolve));

      expect(unhandled).not.toHaveBeenCalled();
      expect(added).not.toHaveBeenCalled();
      expect(component.dialog().isOpen).toBe(true);
      expect(component.newStrategy().title).toBe('Fast B rush');
    });
  });

  describe('opening in the editor', () => {
    it('saves the strategy for the team and navigates to its editor', async () => {
      fixture.componentRef.setInput('team', team);
      const submit = vi.spyOn(apiService, 'submitStrategy').mockReturnValue(of({ ...existingStrategy(), customUrl: 'fast-b-rush' }));
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      await openDialog();
      await typeInto('#strategyName', 'Fast B rush');
      await typeInto('#strategyDescription', 'Everyone rushes B');

      editorButton().click();
      await fixture.whenStable();

      expect(submit.mock.calls[0][0]).toEqual(expect.objectContaining({ title: 'Fast B rush', teamId: 'team-1' }));
      expect(navigate).toHaveBeenCalledWith(['strategies', 'edit', 'fast-b-rush']);
    });

    it('stays put when saving fails', async () => {
      const unhandled = vi.fn();
      config.onUnhandledError = unhandled;
      vi.spyOn(apiService, 'submitStrategy').mockReturnValue(throwError(() => new Error('save failed')));
      const navigate = vi.spyOn(router, 'navigate');
      await openDialog();
      await typeInto('#strategyName', 'Fast B rush');
      await typeInto('#strategyDescription', 'Everyone rushes B');

      editorButton().click();
      await fixture.whenStable();
      await new Promise(resolve => setTimeout(resolve));

      expect(unhandled).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(component.dialog().isOpen).toBe(true);
    });
  });
});
