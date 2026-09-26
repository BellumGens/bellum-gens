import { Component, ElementRef, Injector, OnDestroy, PLATFORM_ID, afterNextRender, inject, signal, viewChild, DestroyRef } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, share, switchMap, tap } from 'rxjs';
import {
  CSGOActiveDutyMap,
  ACTIVE_DUTY,
  CSGOMap,
  StrategyEditor,
  CSGOTeam,
  TeamMember,
  BellumgensApiService,
  STRAT_UTILITIES,
  EDITOR_BRUSH_COLORS,
  CSGOStrategy,
  BaseLayer, PointCoordinate, ImageLayer, FreeflowLayer,
  ApiStrategiesService
} from '../../../../../common/src/public_api';
import { ActivatedRoute } from '@angular/router';
import { IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES, IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_BUTTON_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/button-group';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-strategy-editor',
  templateUrl: './strategy-editor.component.html',
  styleUrls: ['./strategy-editor.component.scss'],
  imports: [
    IGX_SELECT_DIRECTIVES,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_LIST_DIRECTIVES,
    IgxCheckboxComponent,
    IgxIconComponent,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxAvatarComponent,
    IGX_BUTTON_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    ConfirmComponent
  ]
})
export class StrategyEditorComponent implements OnDestroy {
  private apiService = inject(BellumgensApiService);
  private apiStrategyService = inject(ApiStrategiesService);
  private iconService = inject(IgxIconService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  public canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('board');

  public maps: CSGOActiveDutyMap [] = ACTIVE_DUTY;
  public team = signal<CSGOTeam>(null);
  public teammembers = signal<TeamMember []>([]);
  public newStrategy = signal<CSGOStrategy>(null);
  public utility = STRAT_UTILITIES;
  public layers = signal<BaseLayer []>([]);
  public ts = signal([1, 2, 3, 4, 5]);
  public cts = signal([1, 2, 3, 4, 5]);
  public enemies = signal([1, 2, 3, 4, 5]);
  public brushSelected = signal(false);
  public colors = Object.assign([], EDITOR_BRUSH_COLORS);
  public selectedColor = this.colors[0];
  public saveInProgress = signal(false);
  public changes = signal(false);

  private _drag = false;
  private _coordinates: PointCoordinate = {
    x: 0,
    y: 0
  };
  private _drawLayer: FreeflowLayer;
  private intervalId;

  private editor: StrategyEditor;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSvgs();
    }
    // The editor draws on a canvas sized to the window, so it can only be set up in the browser.
    afterNextRender(() => this.initEditor());
  }

  public ngOnDestroy() {
    this.saveStrat();
    clearInterval(this.intervalId);
  }

  public changeMap(map: CSGOMap) {
    this.setMap(this.maps.find(m => m.mapId === map));
    this.changes.set(true);
  }

  public surfaceDrop(args: IDropDroppedEventArgs) {
    args.cancel = true;
    const layer = this.editor.createImageLayer(args.drag.data.name);
    layer.src = args.drag.data.src;
    layer.width = args.drag.data.width;
    layer.height = args.drag.data.height;
    layer.circle = args.drag.data.circle;
    layer.x = args.offsetX - Math.floor(layer.width / 2);
    layer.y = args.offsetY - Math.floor(layer.height / 2);
    this.editor.addLayer(layer);
    layer.selected = true;
    this.syncLayers();

    if (args.drag.data.removeEnemy && this.enemies().length > 1) {
      this.enemies.update(enemies => enemies.slice(1));
    } else if (args.drag.data.removeCT && this.cts().length > 1) {
      this.cts.update(cts => cts.slice(1));
    } else if (args.drag.data.removeT && this.ts().length > 1) {
      this.ts.update(ts => ts.slice(1));
    }
    this.changes.set(true);
  }

  public deleteLayer(layer: BaseLayer) {
    this.editor.removeLayer(layer);
    this.syncLayers();
    this.changes.set(true);
  }

  public saveStrat() {
    if (this.changes() && this.newStrategy()) {
      this.saveInProgress.set(true);
      this.editor.deselectAll();
      this.deselectBrush();
      const strat: CSGOStrategy = {
        ...this.newStrategy(),
        stratImage: this.canvas().nativeElement.toDataURL('image/png'),
        editorMetadata: this.editor.save()
      };
      this.newStrategy.set(strat);
      this.apiStrategyService.submitStrategy(strat).subscribe({
        next: () => this.saveInProgress.set(false),
        error: () => this.saveInProgress.set(false)
      });
      this.changes.set(false);
    }
  }

  public canvasPointerDown(event: PointerEvent) {
    this._drag = true;
    this._coordinates.x = Math.floor(event.offsetX);
    this._coordinates.y = Math.floor(event.offsetY);
    if (this.brushSelected()) {
      if (!this._drawLayer) {
        this._drawLayer = this.editor.createFreeflowLayer();
        this._drawLayer.color = this.selectedColor.color;
        this._drawLayer.x = this._coordinates.x;
        this._drawLayer.y = this._coordinates.y;
        this._drawLayer.createPath();
        this.editor.addLayer(this._drawLayer);
        this.syncLayers();
      } else {
        this._drawLayer.createPath();
      }
    }
  }

  public canvasPointerMove(event: PointerEvent) {
    if (this._drag) {
      const offsetX = Math.floor(event.offsetX);
      const offsetY = Math.floor(event.offsetY);
      if (!this.brushSelected()) {
        this.editor.moveSelected({x: offsetX - this._coordinates.x, y: offsetY - this._coordinates.y});
        this._coordinates.x = offsetX;
        this._coordinates.y = offsetY;
      } else {
        this._drawLayer.addPoint(Object.assign({}, this._coordinates));
        this._coordinates.x = offsetX;
        this._coordinates.y = offsetY;
      }
      this.changes.set(true);
    }
  }

  public canvasPointerUp() {
    this._drag = false;
    this._coordinates.x = 0;
    this._coordinates.y = 0;
    if (this._drawLayer) {
      this._drawLayer.closePath();
      this.changes.set(true);
    }
  }

  public trySelectLayer(event: MouseEvent) {
    this.editor.trySelectLayer({ x: event.offsetX, y: event.offsetY });
  }

  public selectBrush() {
    this.brushSelected.update(selected => !selected);
    this.editor.deselectAll();
  }

  public deselectBrush() {
    this.brushSelected.set(false);
    this._drawLayer = null;
  }

  public selectColor(color) {
    this.selectedColor.selected = false;
    color.selected = true;
    this.selectedColor = color;
    this._drawLayer = null;
  }

  private initEditor() {
    const canvas = this.canvas();
    const size = window.innerHeight - 129;
    canvas.nativeElement.width = size;
    canvas.nativeElement.height = size;
    this.editor = new StrategyEditor(canvas, size / 1024);
    this.syncLayers();
    const strat$ = this.route.params.pipe(
      filter(params => !!params['stratid']),
      switchMap(params => toObservable(this.apiStrategyService.getStrategy(params['stratid']), { injector: this.injector })),
      filter(strat => !!strat),
      takeUntilDestroyed(this.destroyRef),
      share()
    );
    strat$.subscribe(strat => {
      this.newStrategy.set(strat);
      if (strat.editorMetadata) {
        this.editor.restore(strat.editorMetadata);
      }
      this.setMap(this.maps.find(m => m.mapId === strat.map));
    });
    strat$.pipe(
      filter(strat => !!strat.teamId),
      distinctUntilChanged((previous, current) => previous.teamId === current.teamId),
      switchMap(strat => toObservable(this.apiService.getTeam(strat.teamId), { injector: this.injector })),
      filter(team => !!team),
      tap(team => this.team.set(team)),
      switchMap(team => toObservable(this.apiService.getTeamMembers(team.teamId), { injector: this.injector }))
    ).subscribe(members => this.teammembers.set(members));
    this.intervalId = setInterval(() => this.saveStrat(), 300000);
  }

  private setMap(map: CSGOActiveDutyMap) {
    const layers = this.editor.layers;
    if (!layers.length || (layers[0] as ImageLayer).src !== map.radar[0]) {
      const layer = this.editor.createImageLayer('Map Radar');
      layer.src = map.radar[0];
      layer.width = 1024;
      layer.height = 1024;
      layer.movable = false;
      this.editor.replaceLayer(0, layer);
    }
    this.syncLayers();
  }

  // The editor keeps its layers in a mutable array, so hand the template a fresh copy after every change.
  private syncLayers() {
    this.layers.set([...this.editor.layers]);
  }

  private loadSvgs() {
    this.iconService.addSvgIcon('SimpleRadar', '/assets/simple_radar.svg', 'login-icons');
    this.iconService.addSvgIcon('flashbang', '/assets/weapon-icons/svg_normal/weapon_flashbang.svg', 'weapon-icons');
    this.iconService.addSvgIcon('smoke', '/assets/weapon-icons/svg_normal/weapon_smokegrenade.svg', 'weapon-icons');
    this.iconService.addSvgIcon('c4', '/assets/weapon-icons/svg_normal/weapon_c4.svg', 'weapon-icons');
    this.iconService.addSvgIcon('molotov', '/assets/weapon-icons/svg_normal/weapon_molotov.svg', 'weapon-icons');
    this.iconService.addSvgIcon('hegrenade', '/assets/weapon-icons/svg_normal/weapon_hegrenade.svg', 'weapon-icons');
  }
}
