import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveDutyDescriptor, ActiveDuty, CSGOMap } from '../../../models/csgomaps';
import { StrategyEditor, BaseLayer, PointCoordinate, ImageLayer } from '../../../models/strategy-editor';
import { CSGOTeam } from '../../../models/csgoteam';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { IgxDropEventArgs } from 'igniteui-angular';
import { StratUtilities } from '../../../models/utility';
import { TeamStrategy } from '../../../models/csgoteamstrategy';

@Component({
  selector: 'app-strategy-editor',
  templateUrl: './strategy-editor.component.html',
  styleUrls: ['./strategy-editor.component.css']
})
export class StrategyEditorComponent implements OnInit {
  public maps: ActiveDutyDescriptor [] = ActiveDuty;
  public team: CSGOTeam;
  public newStrategy: TeamStrategy;
  public utility = StratUtilities;
  public layers: BaseLayer [];
  public enemies = [1, 1, 1, 1, 1];

  private _activeMap: ActiveDutyDescriptor;
  private _drag = false;
  private _coordinates: PointCoordinate = {
    x: 0,
    y: 0
  };

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

  constructor(private apiService: BellumgensApiService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.editor = new StrategyEditor(this.canvas, parseInt(this.canvas.nativeElement.clientHeight, 10) / 1024);
    this.layers = this.editor.layers;
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
    });
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
    this.newStrategy.EditorMetadata = JSON.stringify(this.layers, ['name', 'x', 'y', 'width', 'height', 'src', 'circle']);
    this.apiService.submitStrategy(this.newStrategy).subscribe();
  }

  public canvasPointerDown(event: PointerEvent) {
    this._drag = true;
    this._coordinates.x = event.x;
    this._coordinates.y = event.y;
  }

  public canvasPointerMove(event: PointerEvent) {
    if (this._drag) {
      this.editor.moveSelected({x: event.x - this._coordinates.x, y: event.y - this._coordinates.y});
      this._coordinates.x = event.x;
      this._coordinates.y = event.y;
    }
  }

  public canvasPointerUp(event: PointerEvent) {
    this._drag = false;
    this._coordinates.x = 0;
    this._coordinates.y = 0;
  }
}
