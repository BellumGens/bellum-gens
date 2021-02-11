import { Pipe, PipeTransform } from '@angular/core';
import { JerseySize, JerseyCut, JerseySizes } from '../../../src-common/models/jerseyorder';

@Pipe({
  name: 'filterSizes'
})
export class FilterSizesPipe implements PipeTransform {

  private femaleSizes: JerseySizes [] = [
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

  public transform(value: JerseySizes [], cut: JerseyCut): JerseySizes [] {
    if (cut === JerseyCut.Male) {
      return this.maleSizes;
    }
    return this.femaleSizes;
  }

}
