import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reduceQuickSearchResult',
    standalone: true
})
export class ReduceQuickSearchResultPipe implements PipeTransform {

  public transform(value: any []): any [] {
    return value ? value.slice(0, 3) : value;
  }

}
