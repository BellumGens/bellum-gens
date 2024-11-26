import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ACTIVE_DUTY, CSGOMapPool } from '../../../../../common/src/public_api';
import { ActiveDutyMapsPipe } from '../../../../../common/src/lib/pipes/active-duty-maps.pipe';
import { FormsModule } from '@angular/forms';
import { IGX_CARD_DIRECTIVES, IgxCheckboxComponent } from '@infragistics/igniteui-angular';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-map-pool',
  templateUrl: './map-pool.component.html',
  styleUrls: ['./map-pool.component.scss'],
  imports: [
    NgClass,
    NgOptimizedImage,
    FormsModule,
    IGX_CARD_DIRECTIVES,
    IgxCheckboxComponent,
    ActiveDutyMapsPipe
  ]
})
export class MapPoolComponent {
  @Input()
  public viewAll = false;

  @Input()
  public set mapPool(maps: CSGOMapPool []) {
    if (maps?.length > 0) {
      this._maps = maps;
      this.augmentActiveDuty();
    }
  }

  @Input()
  public readOnly: boolean;

  @Output()
  public update = new EventEmitter<CSGOMapPool>();

  public maps = structuredClone(ACTIVE_DUTY);

  private _maps: CSGOMapPool [];

  constructor() { }

  public mapChange(map: CSGOMapPool) {
    this.update.emit(map);
  }

  private augmentActiveDuty() {
    this._maps.forEach(map => this.maps.find(m => m.mapId === map.mapId).isPlayed = map.isPlayed);
  }

}
