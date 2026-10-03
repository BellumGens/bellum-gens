import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyEditorComponent } from './strategy-editor.component';
import { ActivatedRoute, Params } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { PLATFORM_ID, Provider, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IDropDroppedEventArgs } from '@infragistics/igniteui-angular/directives';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import {
  ACTIVE_DUTY,
  ApiStrategiesService,
  BellumgensApiService,
  CSGOMap,
  CSGOStrategy,
  CSGOTeam,
  EditorLayer,
  EditorLayerType,
  FreeflowLayer,
  ImageLayer,
  Side,
  StrategyEditor,
  TeamMember
} from '../../../../../common/src/public_api';

const radar = (map: CSGOMap) => ACTIVE_DUTY.find(m => m.mapId === map).radar[0];

const imageMeta = (name: string, src: string, movable = true): EditorLayer => ({
  name, src, movable, x: 10, y: 20, width: 24, height: 24, type: EditorLayerType.Image, displayRatio: 1
});

const strategy = (overrides: Partial<CSGOStrategy> = {}): CSGOStrategy => ({
  id: 'strat-1',
  teamId: null,
  side: Side.TSide,
  title: 'Mid take',
  description: '',
  url: '',
  map: CSGOMap.Mirage,
  ...overrides
});

const dropArgs = (data: Record<string, unknown>, offsetX = 100, offsetY = 100) =>
  ({ cancel: false, offsetX, offsetY, drag: { data } }) as unknown as IDropDroppedEventArgs;

const pointer = (offsetX: number, offsetY: number) => ({ offsetX, offsetY }) as PointerEvent;

describe('StrategyEditorComponent', () => {
  let component: StrategyEditorComponent;
  let fixture: ComponentFixture<StrategyEditorComponent>;
  let params$: BehaviorSubject<Params>;
  let strat: WritableSignal<CSGOStrategy>;
  let team: WritableSignal<CSGOTeam>;
  let members: WritableSignal<TeamMember []>;
  let strategiesService: ApiStrategiesService;
  let apiService: BellumgensApiService;

  const editor = (): StrategyEditor => component['editor'];

  const create = async () => {
    fixture = TestBed.createComponent(StrategyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const configure = async (providers: Provider [] = []) => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StrategyEditorComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: params$ } },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...providers
      ]
    })
    .compileComponents();

    strategiesService = TestBed.inject(ApiStrategiesService);
    apiService = TestBed.inject(BellumgensApiService);
    vi.spyOn(strategiesService, 'getStrategy').mockReturnValue(strat.asReadonly());
    vi.spyOn(apiService, 'getTeam').mockReturnValue(team.asReadonly());
    vi.spyOn(apiService, 'getTeamMembers').mockReturnValue(members.asReadonly());
  };

  beforeEach(() => {
    params$ = new BehaviorSubject<Params>({});
    strat = signal<CSGOStrategy>(null);
    team = signal<CSGOTeam>(null);
    members = signal<TeamMember []>(null);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,board');
  });

  afterEach(() => {
    // Destroy while the canvas stubs are still in place, as the editor saves pending changes on destroy.
    fixture?.destroy();
    fixture = undefined;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await configure();
    });

    it('sizes the canvas to the window and creates the editor after the first render', async () => {
      await create();

      const canvas = fixture.nativeElement.querySelector('canvas.drawing-board') as HTMLCanvasElement;
      expect(canvas.width).toBe(window.innerHeight - 129);
      expect(canvas.height).toBe(window.innerHeight - 129);
      expect(editor()).toBeInstanceOf(StrategyEditor);
      expect(component.layers()).toEqual([]);
    });

    it('registers the editor svg icons', async () => {
      const iconService = TestBed.inject(IgxIconService);
      const addSvgIcon = vi.spyOn(iconService, 'addSvgIcon');
      await create();

      expect(addSvgIcon).toHaveBeenCalledWith('SimpleRadar', '/assets/simple_radar.svg', 'login-icons');
      expect(addSvgIcon).toHaveBeenCalledWith('smoke', '/assets/weapon-icons/svg_normal/weapon_smokegrenade.svg', 'weapon-icons');
    });

    it('does not load a strategy without a strategy id in the route', async () => {
      await create();

      expect(strategiesService.getStrategy).not.toHaveBeenCalled();
      expect(component.newStrategy()).toBeNull();
      expect(fixture.nativeElement.querySelector('#mapSelector')).toBeNull();
    });

    describe('loading a strategy by route id', () => {
      beforeEach(async () => {
        params$.next({ stratid: 'strat-1' });
        await create();
      });

      it('waits for the strategy to arrive', () => {
        expect(strategiesService.getStrategy).toHaveBeenCalledWith('strat-1');
        expect(component.newStrategy()).toBeNull();
      });

      it('sets the strategy and the map radar as the base layer', async () => {
        const loaded = strategy();
        strat.set(loaded);
        await fixture.whenStable();

        expect(component.newStrategy()).toBe(loaded);
        expect(component.layers().length).toBe(1);
        const base = component.layers()[0] as ImageLayer;
        expect(base.name).toBe('Map Radar');
        expect(base.src).toBe(radar(CSGOMap.Mirage));
        expect(base.movable).toBe(false);
        expect(fixture.nativeElement.querySelector('#mapSelector')).toBeTruthy();
        expect(fixture.nativeElement.querySelectorAll('igx-list-item').length).toBe(1);
      });

      it('restores the saved editor layers and keeps a radar that already matches the map', async () => {
        const restore = vi.spyOn(editor(), 'restore');
        const metadata = JSON.stringify([
          imageMeta('Map Radar', radar(CSGOMap.Mirage), false),
          imageMeta('t', '/assets/editor/t-pin.png')
        ]);
        strat.set(strategy({ editorMetadata: metadata }));
        await fixture.whenStable();

        expect(restore).toHaveBeenCalledWith(metadata);
        expect(component.layers().map(l => l.name)).toEqual(['Map Radar', 't']);
        expect(fixture.nativeElement.querySelectorAll('igx-list-item').length).toBe(2);
      });

      it('replaces a restored radar that does not match the strategy map', async () => {
        strat.set(strategy({
          map: CSGOMap.Nuke,
          editorMetadata: JSON.stringify([
            imageMeta('Map Radar', radar(CSGOMap.Dust2), false),
            imageMeta('ct', '/assets/editor/ct-pin.png')
          ])
        }));
        await fixture.whenStable();

        expect(component.layers().length).toBe(2);
        expect((component.layers()[0] as ImageLayer).src).toBe(radar(CSGOMap.Nuke));
        expect(component.layers()[1].name).toBe('ct');
      });

      it('does not load a team for a strategy without one', async () => {
        strat.set(strategy());
        await fixture.whenStable();

        expect(apiService.getTeam).not.toHaveBeenCalled();
        expect(component.team()).toBeNull();
      });
    });

    describe('team strategies', () => {
      beforeEach(async () => {
        params$.next({ stratid: 'strat-1' });
        await create();
        strat.set(strategy({ teamId: 'team-a' }));
        await fixture.whenStable();
      });

      it('loads the team and then its members', async () => {
        expect(apiService.getTeam).toHaveBeenCalledWith('team-a');
        expect(apiService.getTeamMembers).not.toHaveBeenCalled();

        team.set({ teamId: 'team-a', teamName: 'Team A' } as CSGOTeam);
        await fixture.whenStable();

        expect(component.team().teamId).toBe('team-a');
        expect(apiService.getTeamMembers).toHaveBeenCalledWith('team-a');

        members.set([
          { userId: 'u1', username: 'alpha', avatarIcon: 'a.png' },
          { userId: 'u2', username: 'bravo', avatarIcon: 'b.png' }
        ] as TeamMember []);
        await fixture.whenStable();

        expect(component.teammembers().map(m => m.userId)).toEqual(['u1', 'u2']);
        expect(fixture.nativeElement.textContent).toContain('Team');
        const avatars = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('igx-avatar[title]'))
          .map(a => a.getAttribute('title'));
        expect(avatars).toEqual(['alpha', 'bravo']);
      });

      it('does not re-fetch the team when the strategy updates with the same team', async () => {
        team.set({ teamId: 'team-a', teamName: 'Team A' } as CSGOTeam);
        await fixture.whenStable();

        strat.set(strategy({ teamId: 'team-a', title: 'Renamed' }));
        await fixture.whenStable();

        expect(component.newStrategy().title).toBe('Renamed');
        expect(apiService.getTeam).toHaveBeenCalledTimes(1);
        expect(apiService.getTeamMembers).toHaveBeenCalledTimes(1);
      });

      it('fetches the new team when the strategy moves to another team', async () => {
        strat.set(strategy({ teamId: 'team-b' }));
        await fixture.whenStable();

        expect(apiService.getTeam).toHaveBeenCalledTimes(2);
        expect(apiService.getTeam).toHaveBeenLastCalledWith('team-b');
      });
    });

    describe('editing', () => {
      let loaded: CSGOStrategy;

      beforeEach(async () => {
        params$.next({ stratid: 'strat-1' });
        await create();
        loaded = strategy();
        strat.set(loaded);
        await fixture.whenStable();
      });

      it('swaps the radar layer when the map changes', async () => {
        component.changeMap(CSGOMap.Inferno);
        await fixture.whenStable();

        expect(component.layers().length).toBe(1);
        expect((component.layers()[0] as ImageLayer).src).toBe(radar(CSGOMap.Inferno));
        expect(component.changes()).toBe(true);
      });

      it('adds a dropped token at the drop point and takes it from the pool', async () => {
        const args = dropArgs({ name: 't', src: '/assets/editor/t-pin.png', width: 24, height: 24, removeT: true });

        component.surfaceDrop(args);
        await fixture.whenStable();

        expect(args.cancel).toBe(true);
        expect(component.layers().length).toBe(2);
        const token = component.layers()[1] as ImageLayer;
        expect(token.name).toBe('t');
        expect(token.src).toBe('/assets/editor/t-pin.png');
        expect([token.x, token.y]).toEqual([88, 88]);
        expect(token.selected).toBe(true);
        expect(component.ts().length).toBe(4);
        expect(component.cts().length).toBe(5);
        expect(component.changes()).toBe(true);
        expect(fixture.nativeElement.querySelectorAll('igx-list-item').length).toBe(2);
      });

      it('takes CT and enemy tokens from their own pools', () => {
        component.surfaceDrop(dropArgs({ name: 'ct', src: '/assets/editor/ct-pin.png', width: 24, height: 24, removeCT: true }));
        component.surfaceDrop(dropArgs({ name: 'enemy', src: '/assets/editor/ct-t-pin.png', width: 24, height: 24, removeEnemy: true }));

        expect(component.cts().length).toBe(4);
        expect(component.enemies().length).toBe(4);
        expect(component.ts().length).toBe(5);
      });

      it('always leaves one token of each kind in the pool', () => {
        component.ts.set([1]);

        component.surfaceDrop(dropArgs({ name: 't', src: '/assets/editor/t-pin.png', width: 24, height: 24, removeT: true }));

        expect(component.ts()).toEqual([1]);
        expect(component.layers().length).toBe(2);
      });

      it('adds utility without touching the token pools', () => {
        component.surfaceDrop(dropArgs({ name: 'Smoke', src: '/assets/editor/smoke.png', width: 72, height: 72, circle: false }));

        expect(component.layers()[1].name).toBe('Smoke');
        expect([component.ts().length, component.cts().length, component.enemies().length]).toEqual([5, 5, 5]);
      });

      it('removes a layer', async () => {
        component.surfaceDrop(dropArgs({ name: 't', src: '/assets/editor/t-pin.png', width: 24, height: 24 }));
        component.changes.set(false);
        const token = component.layers()[1];

        component.deleteLayer(token);
        await fixture.whenStable();

        expect(component.layers().map(l => l.name)).toEqual(['Map Radar']);
        expect(editor().layers).not.toContain(token);
        expect(component.changes()).toBe(true);
        expect(fixture.nativeElement.querySelectorAll('igx-list-item').length).toBe(1);
      });

      it('moves the selected layer by the pointer delta when not drawing', () => {
        const moveSelected = vi.spyOn(editor(), 'moveSelected');

        component.canvasPointerDown(pointer(10, 10));
        component.canvasPointerMove(pointer(15, 22));
        component.canvasPointerUp();
        component.canvasPointerMove(pointer(50, 50));

        expect(moveSelected).toHaveBeenCalledTimes(1);
        expect(moveSelected).toHaveBeenCalledWith({ x: 5, y: 12 });
        expect(component.changes()).toBe(true);
      });

      it('tries to select a layer under the pointer', () => {
        const trySelect = vi.spyOn(editor(), 'trySelectLayer');

        component.trySelectLayer({ offsetX: 30, offsetY: 40 } as MouseEvent);

        expect(trySelect).toHaveBeenCalledWith({ x: 30, y: 40 });
      });

      it('draws freeflow paths with the brush in the selected color', async () => {
        component.selectBrush();
        await fixture.whenStable();
        expect(component.brushSelected()).toBe(true);
        expect(fixture.nativeElement.textContent).toContain('Brush Color');

        component.canvasPointerDown(pointer(10, 10));
        component.canvasPointerMove(pointer(20, 20));
        component.canvasPointerMove(pointer(30, 30));
        component.canvasPointerUp();

        expect(component.layers().length).toBe(2);
        const drawing = component.layers()[1] as FreeflowLayer;
        expect(drawing).toBeInstanceOf(FreeflowLayer);
        expect(drawing.color).toBe(component.colors[0].color);
        expect(drawing.paths.length).toBe(1);
        expect(component.changes()).toBe(true);

        // A second stroke goes into the same layer.
        component.canvasPointerDown(pointer(40, 40));
        component.canvasPointerUp();
        expect(component.layers().length).toBe(2);
        expect(drawing.paths.length).toBe(2);

        // Picking a new color starts a new layer.
        const blue = component.colors[1];
        component.selectColor(blue);
        expect(blue.selected).toBe(true);
        expect(component.colors[0].selected).toBe(false);
        component.canvasPointerDown(pointer(50, 50));
        expect(component.layers().length).toBe(3);
        expect((component.layers()[2] as FreeflowLayer).color).toBe(blue.color);
        component.selectColor(component.colors[0]);
      });

      it('toggles the brush off again', async () => {
        component.selectBrush();
        component.selectBrush();
        await fixture.whenStable();

        expect(component.brushSelected()).toBe(false);
        expect(fixture.nativeElement.textContent).not.toContain('Brush Color');
      });

      it('does not save without changes', () => {
        const submit = vi.spyOn(strategiesService, 'submitStrategy');

        component.saveStrat();

        expect(submit).not.toHaveBeenCalled();
        const save = fixture.nativeElement.querySelector('button.submit-button') as HTMLButtonElement;
        expect(save.disabled).toBe(true);
      });

      it('submits the board image and editor metadata', async () => {
        const response = new Subject<CSGOStrategy>();
        const submit = vi.spyOn(strategiesService, 'submitStrategy').mockReturnValue(response);
        component.selectBrush();
        component.changeMap(CSGOMap.Inferno);
        await fixture.whenStable();
        const save = fixture.nativeElement.querySelector('button.submit-button') as HTMLButtonElement;
        expect(save.disabled).toBe(false);

        save.click();
        await fixture.whenStable();

        expect(submit).toHaveBeenCalledTimes(1);
        const payload = submit.mock.calls[0][0];
        expect(payload.id).toBe('strat-1');
        expect(payload.title).toBe('Mid take');
        expect(payload.stratImage).toBe('data:image/png;base64,board');
        const layers: EditorLayer [] = JSON.parse(payload.editorMetadata);
        expect(layers.map(l => [l.name, l.src])).toEqual([['Map Radar', radar(CSGOMap.Inferno)]]);
        expect(component.newStrategy()).toBe(payload);
        expect(component.brushSelected()).toBe(false);
        expect(component.changes()).toBe(false);
        expect(component.saveInProgress()).toBe(true);
        expect(save.textContent).toContain('Saving...');
        expect(save.disabled).toBe(true);

        response.next(payload);
        await fixture.whenStable();

        expect(component.saveInProgress()).toBe(false);
        expect(save.textContent).toContain('Save');
      });

      it('ends the save in progress when the save fails', () => {
        const response = new Subject<CSGOStrategy>();
        vi.spyOn(strategiesService, 'submitStrategy').mockReturnValue(response);
        component.changeMap(CSGOMap.Inferno);

        component.saveStrat();
        response.error(new Error('offline'));

        expect(component.saveInProgress()).toBe(false);
      });

      it('saves pending changes when destroyed', () => {
        const submit = vi.spyOn(strategiesService, 'submitStrategy').mockReturnValue(new Subject<CSGOStrategy>());
        component.changeMap(CSGOMap.Inferno);

        fixture.destroy();

        expect(submit).toHaveBeenCalledTimes(1);
      });
    });

    describe('autosave', () => {
      beforeEach(async () => {
        vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
        params$.next({ stratid: 'strat-1' });
        await create();
        strat.set(strategy());
        await fixture.whenStable();
      });

      it('saves changes every five minutes', () => {
        const submit = vi.spyOn(strategiesService, 'submitStrategy').mockReturnValue(new Subject<CSGOStrategy>());
        component.changeMap(CSGOMap.Inferno);

        vi.advanceTimersByTime(299999);
        expect(submit).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(submit).toHaveBeenCalledTimes(1);

        // Nothing changed since, so the next tick doesn't save again.
        vi.advanceTimersByTime(300000);
        expect(submit).toHaveBeenCalledTimes(1);
      });

      it('stops autosaving once destroyed', () => {
        const submit = vi.spyOn(strategiesService, 'submitStrategy').mockReturnValue(new Subject<CSGOStrategy>());
        fixture.destroy();
        expect(vi.getTimerCount()).toBe(0);

        component.changes.set(true);
        vi.advanceTimersByTime(600000);

        expect(submit).not.toHaveBeenCalled();
      });
    });
  });

  describe('on the server', () => {
    const globals = globalThis as { ngServerMode?: boolean };
    let serverMode: boolean;

    beforeEach(async () => {
      // Angular skips render hooks on the server via the ngServerMode flag the SSR build sets.
      serverMode = globals.ngServerMode;
      globals.ngServerMode = true;
      await configure([{ provide: PLATFORM_ID, useValue: 'server' }]);
    });

    afterEach(() => {
      globals.ngServerMode = serverMode;
    });

    it('does not touch the canvas, the icons or the route', async () => {
      const iconService = TestBed.inject(IgxIconService);
      const addSvgIcon = vi.spyOn(iconService, 'addSvgIcon');
      const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
      params$.next({ stratid: 'strat-1' });
      strat.set(strategy({ teamId: 'team-a' }));

      await create();

      expect(editor()).toBeUndefined();
      expect(getContext).not.toHaveBeenCalled();
      expect(addSvgIcon).not.toHaveBeenCalled();
      expect(strategiesService.getStrategy).not.toHaveBeenCalled();
      expect(component.layers()).toEqual([]);
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
