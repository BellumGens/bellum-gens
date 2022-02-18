import { Pipe, PipeTransform } from '@angular/core';
import { ActiveDuty } from '../../models/csgomaps';

@Pipe({
  name: 'activeDutyMaps'
})
export class ActiveDutyMapsPipe implements PipeTransform {
  private activeDuty = ActiveDuty;

  public transform(maps: any [], viewAll: boolean = true, _?: number): any [] {
    if (maps && !viewAll) {
      return maps.filter(m => this.activeDuty.find(a => a.id === m.map).active);
    }
    return maps;
  }

}
