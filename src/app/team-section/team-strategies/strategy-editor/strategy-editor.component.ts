import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveDutyDescriptor, ActiveDuty } from 'src/app/models/csgomaps';

@Component({
  selector: 'app-strategy-editor',
  templateUrl: './strategy-editor.component.html',
  styleUrls: ['./strategy-editor.component.css']
})
export class StrategyEditorComponent implements OnInit {
  public maps: ActiveDutyDescriptor [] = ActiveDuty;

  private _activeMap: ActiveDutyDescriptor;

  public get map() {
    return this._activeMap;
  }

  public set map(map: ActiveDutyDescriptor) {
    this._activeMap = map;
    this.renderContext();
  }

  private context;

  @ViewChild('board') public canvas: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  public changeMap(map: ActiveDutyDescriptor) {
    this.map = map;
  }

  public renderContext() {
    this.context = this.canvas.nativeElement.getContext('2d');
    const image = new Image();
    image.src = this._activeMap.radar[0];
    image.onload = () => {
      this.context.drawImage(image, 0, 0, 1024, 1024);
    };
  }
}
