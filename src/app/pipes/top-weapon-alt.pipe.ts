import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topWeaponAlt'
})
export class TopWeaponAltPipe implements PipeTransform {

  transform(weapon: any): any {
    return weapon ? weapon.kills + ' kills' : '';
  }

}
