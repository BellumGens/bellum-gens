import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CSGOActiveDutyDescriptor, ActiveDuty, CSGOMap } from '../../../../../src-common/models/csgomaps';
import { StrategyEditor } from '../../../../../src-common/models/strat-editor/strategy-editor';
import { CSGOTeam } from '../../../../../src-common/models/csgoteam';
import { BellumgensApiService } from '../../../../../src-common/services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { IDropDroppedEventArgs, IgxIconService } from '@infragistics/igniteui-angular';
import { StratUtilities, EditorBrushColors } from '../../../../../src-common/models/strat-editor/utility';
import { CSGOStrategy } from '../../../../../src-common/models/csgostrategy';
import { BaseLayer, PointCoordinate, ImageLayer, FreeflowLayer } from '../../../../../src-common/models/strat-editor/editor-layer';
import { BaseComponent } from '../../../base/base.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-strategy-editor',
  templateUrl: './strategy-editor.component.html',
  styleUrls: ['./strategy-editor.component.css']
})
export class StrategyEditorComponent extends BaseComponent implements OnInit, OnDestroy {
  public maps: CSGOActiveDutyDescriptor [] = ActiveDuty;
  public team: CSGOTeam;
  public newStrategy: CSGOStrategy;
  public utility = StratUtilities;
  public layers: BaseLayer [];
  public ts = [1, 1, 1, 1, 1];
  public cts = [1, 1, 1, 1, 1];
  public enemies = [1, 1, 1, 1, 1];
  public brushSelected = false;
  public colors = Object.assign([], EditorBrushColors);
  public selectedColor = this.colors[0];
  public saveInProgress = false;
  public changes = false;

  private _activeMap: CSGOActiveDutyDescriptor;
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

  public set map(map: CSGOActiveDutyDescriptor) {
    this._activeMap = map;
    if (!this.layers.length || (<ImageLayer>this.layers[0]).src !== map.radar[0]) {
      const layer = this.editor.createImageLayer('Map Radar');
      layer.src = this._activeMap.radar[0];
      layer.width = 1024;
      layer.height = 1024;
      layer.movable = false;
      this.editor.replaceLayer(0, layer);
    }
  }

  private editor: StrategyEditor;

  @ViewChild('board', { static: true }) public canvas: ElementRef;

  constructor(private apiService: BellumgensApiService,
              private iconService: IgxIconService,
              private route: ActivatedRoute,
              title: Title,
              meta: Meta) {
    super(title, meta, route);
    this.loadSvgs();
  }

  ngOnInit() {
    this.canvas.nativeElement.width = window.innerHeight - 140;
    this.canvas.nativeElement.height = window.innerHeight - 140;
    this.editor = new StrategyEditor(this.canvas, (window.innerHeight - 140) / 1024);
    this.layers = this.editor.layers;
    this.subs.push(
      this.route.params.subscribe(params => {
        const teamId = params['teamid'];
        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => this.team = team);
        }
        const stratid = params['stratid'];
        if (stratid) {
          this.apiService.getCurrentStrategy(stratid).subscribe(strat => {
            if (strat) {
              this.newStrategy = strat;
              if (strat.EditorMetadata) {
                this.editor.restore(strat.EditorMetadata);
              }
              this.map = this.maps.find(m => m.id === strat.Map);
            }
          });
        }
      })
    );
    this.intervalId = setInterval(this.saveStrat.bind(this), 300000);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.saveStrat();
    clearInterval(this.intervalId);
  }

  public changeMap(map: CSGOMap) {
    this.map = this.maps.find(m => m.id === map);
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
      this.newStrategy.Image = this.canvas.nativeElement.toDataURL('image/png');
      this.newStrategy.EditorMetadata = this.editor.save();
      this.apiService.submitStrategy(this.newStrategy).subscribe(
        _ => this.saveInProgress = false,
        _ => this.saveInProgress = false
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

  public trySelectLayer(event: PointerEvent) {
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
