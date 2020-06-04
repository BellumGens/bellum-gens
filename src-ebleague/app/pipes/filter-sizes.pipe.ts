import { Pipe, PipeTransform } from '@angular/core';
import { JerseySize, JerseyCut } from '../../../src-common/models/jerseyorder';

@Pipe({
  name: 'filterSizes'
})
export class FilterSizesPipe implements PipeTransform {

  private femaleSizes = [
    { text: 'XS', size: JerseySize.XS },
    { text: 'S', size: JerseySize.S },
    { text: 'M', size: JerseySize.M },
    { text: 'L', size: JerseySize.L },
    { text: 'XL', size: JerseySize.XL }
  ];

  private maleSizes = [
    { text: 'S', size: JerseySize.S },
    { text: 'M', size: JerseySize.M },
    { text: 'L', size: JerseySize.L },
    { text: 'XL', size: JerseySize.XL },
    { text: 'XXL', size: JerseySize.XXL },
    { text: 'XXXL', size: JerseySize.XXXL }
  ];

  transform(value: object [], cut: JerseyCut): unknown {
    if (cut === JerseyCut.Male) {
      return this.maleSizes;
    }
    return this.femaleSizes;
  }

}
