import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'topWeaponAlt',
    standalone: true
})
export class TopWeaponAltPipe implements PipeTransform {

  public transform(weapon: any): string {
    return weapon ? weapon.kills + ' kills' : '';
  }

}
