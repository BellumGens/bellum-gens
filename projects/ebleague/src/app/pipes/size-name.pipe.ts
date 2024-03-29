import { Pipe, PipeTransform } from '@angular/core';
import { JerseySize } from '../../../../common/src/public_api';

@Pipe({
    name: 'sizeName',
    standalone: true
})
export class SizeNamePipe implements PipeTransform {
  private allSizes = [
    { text: 'XS', size: JerseySize.S },
    { text: 'S', size: JerseySize.S },
    { text: 'M', size: JerseySize.M },
    { text: 'L', size: JerseySize.L },
    { text: 'XL', size: JerseySize.XL },
    { text: 'XXL', size: JerseySize.XXL },
    { text: 'XXXL', size: JerseySize.XXXL }
  ];

  public transform(size: JerseySize): string {
    return this.allSizes.find(s => s.size === size).text;
  }

}
