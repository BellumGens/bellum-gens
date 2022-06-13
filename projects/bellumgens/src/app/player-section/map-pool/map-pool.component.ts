import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ActiveDuty, CSGOActiveDutyDescriptor, CSGOMapPool } from '../../../../../common/src/public_api';

@Component({
  selector: 'app-map-pool',
  templateUrl: './map-pool.component.html',
  styleUrls: ['./map-pool.component.scss']
})
export class MapPoolComponent {
  @Input()
  public viewAll = false;

  @Input()
  public set mapPool(maps: CSGOMapPool []) {
    if (maps?.length) {
      this._maps = maps;
      this.augmentActiveDuty();
    }
  }

  @Input()
  public readOnly: boolean;

  @Output()
  public update = new EventEmitter<CSGOActiveDutyDescriptor>();

  public maps = ActiveDuty;

  private _maps: CSGOMapPool [];

  constructor() { }

  public mapChange(map: CSGOActiveDutyDescriptor) {
    this.update.emit(map);
  }

  private augmentActiveDuty() {
    this._maps.forEach(map => this.maps.find(m => m.id === map.map).isPlayed = map.isPlayed);
  }

}
