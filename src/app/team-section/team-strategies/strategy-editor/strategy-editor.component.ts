import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveDutyDescriptor, ActiveDuty } from '../../../models/csgomaps';
import { StrategyEditor } from '../../../models/strategy-editor';
import { CSGOTeam } from '../../../models/csgoteam';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { IgxDropEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-strategy-editor',
  templateUrl: './strategy-editor.component.html',
  styleUrls: ['./strategy-editor.component.css']
})
export class StrategyEditorComponent implements OnInit {
  public maps: ActiveDutyDescriptor [] = ActiveDuty;
  public team: CSGOTeam;

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
    this.renderContext();
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
  }

  ngOnInit() {
    this.editor = new StrategyEditor(this.canvas);
  }

  public changeMap(map: ActiveDutyDescriptor) {
    this.map = map;
  }

  public surfaceDrop(args: IgxDropEventArgs) {
    args.cancel = true;
    console.log(args);
  }

  public renderContext() {
    this.editor.flip();
  }
}
