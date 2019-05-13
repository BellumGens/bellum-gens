import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveDutyDescriptor, ActiveDuty, CSGOMap } from '../../../models/csgomaps';
import { StrategyEditor } from '../../../models/strat-editor/strategy-editor';
import { CSGOTeam } from '../../../models/csgoteam';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { IgxDropEventArgs } from 'igniteui-angular';
import { StratUtilities, EditorBrushColors } from '../../../models/strat-editor/utility';
import { TeamStrategy } from '../../../models/csgoteamstrategy';
import { BaseLayer, PointCoordinate, ImageLayer, FreeflowLayer } from '../../../models/strat-editor/editor-layer';
import { BaseComponent } from '../../../base/base.component';

@Component({
  selector: 'app-strategy-editor',
  templateUrl: './strategy-editor.component.html',
  styleUrls: ['./strategy-editor.component.css']
})
export class StrategyEditorComponent extends BaseComponent implements OnInit {
  public maps: ActiveDutyDescriptor [] = ActiveDuty;
  public team: CSGOTeam;
  public newStrategy: TeamStrategy;
  public utility = StratUtilities;
  public layers: BaseLayer [];
  public enemies = [1, 1, 1, 1, 1];
  public brushSelected = false;
  public colors = Object.assign([], EditorBrushColors);
  public selectedColor = this.colors[0];

  private _activeMap: ActiveDutyDescriptor;
  private _drag = false;
  private _coordinates: PointCoordinate = {
    x: 0,
    y: 0
  };
  private _drawLayer: FreeflowLayer;

  public get map() {
    return this._activeMap;
  }

  public set map(map: ActiveDutyDescriptor) {
    this._activeMap = map;
    if (!this.layers.length || (<ImageLayer>this.layers[0]).src !== map.radar[0]) {
      const layer = this.editor.createImageLayer();
      layer.src = this._activeMap.radar[0];
      layer.width = 1024;
      layer.height = 1024;
      this.editor.replaceLayer(0, layer);
    }
  }

  private editor: StrategyEditor;

  @ViewChild('board') public canvas: ElementRef;

  constructor(private apiService: BellumgensApiService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.editor = new StrategyEditor(this.canvas, parseInt(this.canvas.nativeElement.clientHeight, 10) / 1024);
    this.layers = this.editor.layers;
    this.subs.push(this.route.params.subscribe(params => {
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
    }));
  }

  public changeMap(map: CSGOMap) {
    this.map = this.maps.find(m => m.id === map);
  }

  public surfaceDrop(args: IgxDropEventArgs) {
    args.cancel = true;
    const layer = this.editor.createImageLayer();
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
    }
  }

  public deleteLayer(layer: BaseLayer) {
    this.editor.removeLayer(layer);
  }

  public saveStrat() {
    this.editor.deselectAll();
    this.newStrategy.Image = this.canvas.nativeElement.toDataURL('image/png');
    this.newStrategy.EditorMetadata = JSON.stringify(this.layers,
                    ['name', 'displayRatio', 'x', 'y', 'width', 'height', 'src', 'circle', 'paths', 'points', 'color', 'type']);
    this.apiService.submitStrategy(this.newStrategy).subscribe();
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
    }
  }

  public canvasPointerUp() {
    this._drag = false;
    this._coordinates.x = 0;
    this._coordinates.y = 0;
    if (this._drawLayer) {
      this._drawLayer.closePath();
    }
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
}
