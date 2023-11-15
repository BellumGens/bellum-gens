import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'countrySVG',
    standalone: true
})
export class CountrySVGPipe implements PipeTransform {

  public transform(country: string): string {
    if (!country) {
      return '';
    }
    return 'assets/country-flags/svg/' + country.toLowerCase() + '.svg';
  }

}
