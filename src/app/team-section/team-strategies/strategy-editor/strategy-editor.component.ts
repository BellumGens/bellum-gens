import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveDutyDescriptor, ActiveDuty } from '../../../models/csgomaps';
import { StrategyEditor, BaseLayer } from '../../../models/strategy-editor';
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

  private _activeMap: ActiveDutyDescriptor;

  public get map() {
    return this._activeMap;
  }

  public set map(map: ActiveDutyDescriptor) {
    this._activeMap = map;
    const layer = this.editor.createImageLayer();
    layer.src = this._activeMap.radar[0];
    layer.width = 1024;
    layer.height = 1024;
    this.editor.replaceLayer(0, layer);
  }

  private editor: StrategyEditor;

  @ViewChild('board') public canvas: ElementRef;

  constructor(private apiService: BellumgensApiService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const teamId = params['teamid'];
      if (params['teamid']) {
        this.apiService.getTeam(teamId).subscribe(team => this.team = team);
      }
    });
    this.apiService.currentStrategy.subscribe(strat => this.newStrategy = strat);
  }

  ngOnInit() {
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.editor = new StrategyEditor(this.canvas, parseInt(this.canvas.nativeElement.clientHeight, 10) / 1024);
    this.layers = this.editor.layers;
  }

  public changeMap(map: ActiveDutyDescriptor) {
    this.map = map;
  }

  public surfaceDrop(args: IgxDropEventArgs) {
    args.cancel = true;
    const layer = this.editor.createImageLayer();
    layer.src = args.drag.data.src;
    layer.width = args.drag.data.width;
    layer.height = args.drag.data.height;
    layer.circle = args.drag.data.circle;
    this.editor.addLayer(layer);
  }

  public deleteLayer(layer: BaseLayer) {
    this.editor.removeLayer(layer);
  }

  public saveStrat() {
    this.newStrategy.Image = this.canvas.nativeElement.toDataURL('image/png');
    this.apiService.submitStrategy(this.newStrategy).subscribe();
  }
}
