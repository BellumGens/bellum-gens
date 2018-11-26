import { Pipe, PipeTransform } from '@angular/core';
import { TeamStrategy, Side } from '../models/csgoteamstrategy';

@Pipe({
  name: 'sidestrats'
})
export class SideStratsPipe implements PipeTransform {

  transform(strats: TeamStrategy [], args: Side): any {
    return strats.filter(s => s.Side === args);
  }

}
