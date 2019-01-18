import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topWeaponSvg'
})
export class TopWeaponSvgPipe implements PipeTransform {

  transform(weapon: any): any {
    return weapon ? 'assets/weapon-icons/svg_normal/weapon_' + weapon.name + '.svg' : null;
  }

}
