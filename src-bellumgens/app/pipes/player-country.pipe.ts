import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerCountry'
})
export class PlayerCountryPipe implements PipeTransform {

  public transform(country: string): string {
    if (!country) {
      return null;
    }
    return 'assets/country-flags/svg/' + country.toLowerCase() + '.svg';
  }

}
