import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CSGOMapPool } from '../../../../src-common/models/csgomaps';

@Component({
  selector: 'app-map-pool',
  templateUrl: './map-pool.component.html',
  styleUrls: ['./map-pool.component.css']
})
export class MapPoolComponent {
  @Input()
  public viewAll = false;

  @Input()
  mapPool: Observable<CSGOMapPool []>;

  @Input()
  readOnly: boolean;

  @Output()
  update = new EventEmitter<CSGOMapPool>();

  constructor() { }

  public mapChange(args) {
    args.checkbox.value.IsPlayed = args.checked;
    this.update.emit(args.checkbox.value);
  }

}
