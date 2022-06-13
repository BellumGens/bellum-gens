import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {

  public transform(maps: any [], viewAll: boolean = true, _?: number): any [] {
    if (maps && !viewAll) {
      return maps.filter(m => m.active);
    }
    return maps;
  }

}
