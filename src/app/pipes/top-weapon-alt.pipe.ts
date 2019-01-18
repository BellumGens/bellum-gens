import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topWeaponAlt'
})
export class TopWeaponAltPipe implements PipeTransform {

  transform(weapon: any, title?: boolean): any {
    if (title) {
      return weapon.kills + ' kills';
    }
    return 'Top Weapon with ' + weapon.kills + ' kills: ' + weapon.name;
  }

}
