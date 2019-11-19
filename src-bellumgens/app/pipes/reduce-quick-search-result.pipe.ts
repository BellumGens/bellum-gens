import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceQuickSearchResult'
})
export class ReduceQuickSearchResultPipe implements PipeTransform {

  transform(value: any []): any [] {
    return value ? value.slice(0, 3) : value;
  }

}
