import { Pipe, PipeTransform } from '@angular/core';
import { JerseySize, JerseyCut, JerseySizes } from '../../../src-common/models/jerseyorder';

@Pipe({
  name: 'filterSizes'
})
export class FilterSizesPipe implements PipeTransform {

  transform(values: JerseySizes [], cut: JerseyCut): unknown {
    if (values && values.length && cut === JerseyCut.Male) {
      values.forEach(v => {
        if (v.size === JerseySize.XS) {
          v.disabled = true;
        } else if (v.size === JerseySize.XXL || v.size === JerseySize.XXXL) {
          v.disabled = false;
        }
      });
    } else if (values && values.length && cut === JerseyCut.Female) {
      values.forEach(v => {
        if (v.size === JerseySize.XS) {
          v.disabled = false;
        } else if (v.size === JerseySize.XXL || v.size === JerseySize.XXXL) {
          v.disabled = true;
        }
      });
    }
    return values;
  }

}
