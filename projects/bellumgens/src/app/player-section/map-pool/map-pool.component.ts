import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CSGOMapPool } from '../../../../../common/src/public_api';

@Component({
  selector: 'app-map-pool',
  templateUrl: './map-pool.component.html',
  styleUrls: ['./map-pool.component.scss']
})
export class MapPoolComponent {
  @Input()
  public viewAll = false;

  @Input()
  public mapPool: Observable<CSGOMapPool []>;

  @Input()
  public readOnly: boolean;

  @Output()
  public update = new EventEmitter<CSGOMapPool>();

  constructor() { }

  public mapChange(map: CSGOMapPool) {
    this.update.emit(map);
  }

}
