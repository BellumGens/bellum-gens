import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
    name: 'countrySVG'
})
export class CountrySVGPipe implements PipeTransform {

  public transform(country: string | null | undefined): string {
    if (!country) {
      return '';
    }
    return 'assets/country-flags/svg/' + country.split(' ').join('-').toLowerCase() + '.svg';
  }

}
