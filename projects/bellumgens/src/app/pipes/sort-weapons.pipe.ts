import { Pipe, PipeTransform } from '@angular/core';
import { WeaponDescriptor } from 'bellum-gens-common/models';

@Pipe({
    name: 'sortWeapons'
})
export class SortWeaponsPipe implements PipeTransform {
  private _filter = new Set<string>(['headshot', 'enemy_weapon', 'against_zoomed_sniper', 'enemy_blinded', 'knife_fight']);

  public transform(weapons: WeaponDescriptor [] | null | undefined): WeaponDescriptor [] | null {
    if (!weapons) {
      return null;
    }
    return weapons.filter(w => !this._filter.has(w.name)).sort((a, b) => a.kills > b.kills ? -1 : a.kills === b.kills ? 0 : 1).slice(0, 5);
  }

}
