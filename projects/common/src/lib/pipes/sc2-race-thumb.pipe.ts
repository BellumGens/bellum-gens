import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'sc2RaceThumb',
  standalone: true,
})
export class Sc2RaceThumbPipe implements PipeTransform {

  public transform(value: string): string {
    return 'assets/bge/race/' + value.toLowerCase() + '.png';
  }

}
