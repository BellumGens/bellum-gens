import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerCountry'
})
export class PlayerCountryPipe implements PipeTransform {

  transform(country: string): string {
    return 'assets/country-flags/svg/' + country.toLowerCase() + '.svg';
  }

}
