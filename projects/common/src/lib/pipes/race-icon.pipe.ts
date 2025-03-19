import { Pipe, type PipeTransform } from '@angular/core';
import { type SC2Race } from '../../public_api';

@Pipe({
  name: 'raceIcon',
})
export class RaceIconPipe implements PipeTransform {

  private readonly raceIcons: string [] = [
    '',
    'assets/bge/race/protoss.png',
    'assets/bge/race/terran.png',
    'assets/bge/race/zerg.png'
  ]

  public transform(value: SC2Race): string {
    return value ? this.raceIcons[value] : '';
  }

}
