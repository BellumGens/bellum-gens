import { Component, OnInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
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
import { NgClass } from '@angular/common';

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
    NgClass,
    IgxIconComponent,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxAvatarComponent,
    IGX_BUTTON_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    ConfirmComponent
  ]
})
export class StrategyEditorComponent implements OnInit, OnDestroy {
  private apiService = inject(BellumgensApiService);
  private apiStrategyService = inject(ApiStrategiesService);
  private iconService = inject(IgxIconService);
  private route = inject(ActivatedRoute);

  @ViewChild('board', { static: true }) public canvas: ElementRef;

  public maps: CSGOActiveDutyMap [] = ACTIVE_DUTY;
  public team: CSGOTeam;
  public teammembers: TeamMember [];
  public newStrategy: CSGOStrategy;
  public utility = STRAT_UTILITIES;
  public layers: BaseLayer [];
  public ts = [1, 2, 3, 4, 5];
  public cts = [1, 2, 3, 4, 5];
  public enemies = [1, 2, 3, 4, 5];
  public brushSelected = false;
  public colors = Object.assign([], EDITOR_BRUSH_COLORS);
  public selectedColor = this.colors[0];
  public saveInProgress = false;
  public changes = false;

  private _activeMap: CSGOActiveDutyMap;
  private _drag = false;
  private _coordinates: PointCoordinate = {
    x: 0,
    y: 0
  };
  private _drawLayer: FreeflowLayer;
  private intervalId;

  public get map() {
    return this._activeMap;
  }

  public set map(map: CSGOActiveDutyMap) {
    this._activeMap = map;
    if (!this.layers.length || (this.layers[0] as ImageLayer).src !== map.radar[0]) {
      const layer = this.editor.createImageLayer('Map Radar');
      layer.src = this._activeMap.radar[0];
      layer.width = 1024;
      layer.height = 1024;
      layer.movable = false;
      this.editor.replaceLayer(0, layer);
    }
  }

  private editor: StrategyEditor;

  constructor() {
    this.loadSvgs();
  }

  public ngOnInit() {
    this.canvas.nativeElement.width = window.innerHeight - 129;
    this.canvas.nativeElement.height = window.innerHeight - 129;
    this.editor = new StrategyEditor(this.canvas, (window.innerHeight - 129) / 1024);
    this.layers = this.editor.layers;
    this.route.params.subscribe(params => {
      const stratid = params['stratid'];
      if (stratid) {
        this.apiStrategyService.getStrategy(stratid).subscribe(strat => {
          if (strat) {
            this.newStrategy = strat;
            if (strat.teamId) {
              this.apiService.getTeam(strat.teamId).subscribe(team => {
                if (team) {
                  this.team = team;
                  this.apiService.getTeamMembers(team.teamId).subscribe(members => this.teammembers = members);
                }
              });
            }
            if (strat.editorMetadata) {
              this.editor.restore(strat.editorMetadata);
            }
            this.map = this.maps.find(m => m.mapId === strat.map);
          }
        });
      }
    });
    this.intervalId = setInterval(this.saveStrat.bind(this), 300000);
  }

  public ngOnDestroy() {
    this.saveStrat();
    clearInterval(this.intervalId);
  }

  public changeMap(map: CSGOMap) {
    this.map = this.maps.find(m => m.mapId === map);
    this.changes = true;
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

    if (args.drag.data.removeEnemy && this.enemies.length > 1) {
      this.enemies.splice(0, 1);
    } else if (args.drag.data.removeCT && this.cts.length > 1) {
      this.cts.splice(0, 1);
    } else if (args.drag.data.removeT && this.ts.length > 1) {
      this.ts.splice(0, 1);
    }
    this.changes = true;
  }

  public deleteLayer(layer: BaseLayer) {
    this.editor.removeLayer(layer);
    this.changes = true;
  }

  public saveStrat() {
    if (this.changes) {
      this.saveInProgress = true;
      this.editor.deselectAll();
      this.deselectBrush();
      this.newStrategy.stratImage = this.canvas.nativeElement.toDataURL('image/png');
      this.newStrategy.editorMetadata = this.editor.save();
      this.apiStrategyService.submitStrategy(this.newStrategy).subscribe(
        () => this.saveInProgress = false,
        () => this.saveInProgress = false
      );
      this.changes = false;
    }
  }

  public canvasPointerDown(event: PointerEvent) {
    this._drag = true;
    this._coordinates.x = Math.floor(event.offsetX);
    this._coordinates.y = Math.floor(event.offsetY);
    if (this.brushSelected) {
      if (!this._drawLayer) {
        this._drawLayer = this.editor.createFreeflowLayer();
        this._drawLayer.color = this.selectedColor.color;
        this._drawLayer.x = this._coordinates.x;
        this._drawLayer.y = this._coordinates.y;
        this._drawLayer.createPath();
        this.editor.addLayer(this._drawLayer);
      } else {
        this._drawLayer.createPath();
      }
    }
  }

  public canvasPointerMove(event: PointerEvent) {
    if (this._drag) {
      const offsetX = Math.floor(event.offsetX);
      const offsetY = Math.floor(event.offsetY);
      if (!this.brushSelected) {
        this.editor.moveSelected({x: offsetX - this._coordinates.x, y: offsetY - this._coordinates.y});
        this._coordinates.x = offsetX;
        this._coordinates.y = offsetY;
      } else {
        this._drawLayer.addPoint(Object.assign({}, this._coordinates));
        this._coordinates.x = offsetX;
        this._coordinates.y = offsetY;
      }
      this.changes = true;
    }
  }

  public canvasPointerUp() {
    this._drag = false;
    this._coordinates.x = 0;
    this._coordinates.y = 0;
    if (this._drawLayer) {
      this._drawLayer.closePath();
      this.changes = true;
    }
  }

  public trySelectLayer(event: MouseEvent) {
    this.editor.trySelectLayer({ x: event.offsetX, y: event.offsetY });
  }

  public selectBrush() {
    this.brushSelected = !this.brushSelected;
    this.editor.deselectAll();
  }

  public deselectBrush() {
    this.brushSelected = false;
    this._drawLayer = null;
  }

  public selectColor(color) {
    this.selectedColor.selected = false;
    color.selected = true;
    this.selectedColor = color;
    this._drawLayer = null;
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
