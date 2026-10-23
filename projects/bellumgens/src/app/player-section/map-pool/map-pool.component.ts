import { Component, input, linkedSignal, output } from '@angular/core';
import { ACTIVE_DUTY, CSGOActiveDutyMap, CSGOMapPool } from '../../../../../common/src/public_api';
import { ActiveDutyMapsPipe } from '../../../../../common/src/lib/pipes/active-duty-maps.pipe';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-map-pool',
  templateUrl: './map-pool.component.html',
  styleUrls: ['./map-pool.component.scss'],
  imports: [
    NgOptimizedImage,
    IGX_CARD_DIRECTIVES,
    IgxCheckboxComponent,
    ActiveDutyMapsPipe
  ]
})
export class MapPoolComponent {
  public viewAll = input(false);

  public mapPool = input<CSGOMapPool []>();

  public readOnly = input<boolean>();

  public update = output<CSGOMapPool>();

  // The active duty maps augmented with the player's pool. Re-seeded whenever
  // a new pool comes in, and updated locally as maps get toggled.
  public maps = linkedSignal<CSGOActiveDutyMap []>(() => {
    const pool = this.mapPool();
    return ACTIVE_DUTY.map(map => {
      const played = pool?.find(m => m.mapId === map.mapId);
      return played ? { ...map, isPlayed: played.isPlayed } : { ...map };
    });
  });

  public mapChange(map: CSGOActiveDutyMap, isPlayed: boolean) {
    const updated = { ...map, isPlayed };
    this.maps.update(maps => maps.map(m => m.mapId === map.mapId ? updated : m));
    this.update.emit({ ...updated });
  }
}
