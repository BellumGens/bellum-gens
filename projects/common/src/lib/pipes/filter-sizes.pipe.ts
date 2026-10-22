import { Pipe, PipeTransform } from '@angular/core';
import { JerseyCut, JerseySize, JerseySizes } from '../../models/order';

const FEMALE_SIZES: JerseySizes [] = [
  { text: 'XS', size: JerseySize.XS },
  { text: 'S', size: JerseySize.S },
  { text: 'M', size: JerseySize.M },
  { text: 'L', size: JerseySize.L },
  { text: 'XL', size: JerseySize.XL }
];

const MALE_SIZES: JerseySizes [] = [
  { text: 'S', size: JerseySize.S },
  { text: 'M', size: JerseySize.M },
  { text: 'L', size: JerseySize.L },
  { text: 'XL', size: JerseySize.XL },
  { text: 'XXL', size: JerseySize.XXL },
  { text: 'XXXL', size: JerseySize.XXXL }
];

/** The sizes a jersey of the given cut is available in. */
export const jerseySizes = (cut: JerseyCut): JerseySizes [] => cut === JerseyCut.Male ? MALE_SIZES : FEMALE_SIZES;

/** Whether a jersey of the given cut is available in the given size. */
export const isJerseySizeAvailable = (cut: JerseyCut, size: JerseySize): boolean =>
  jerseySizes(cut).some(s => s.size === size);

@Pipe({
    name: 'filterSizes'
})
export class FilterSizesPipe implements PipeTransform {
  public transform(cut: JerseyCut): JerseySizes [] {
    return jerseySizes(cut);
  }
}
