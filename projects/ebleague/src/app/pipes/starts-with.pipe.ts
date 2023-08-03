import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'startsWith',
    standalone: true
})
export class StartsWithPipe implements PipeTransform {

  public transform(collection: string[], term = ''): string[] {
    if (collection) {
      return collection.filter((item) => item.toLowerCase().startsWith(term.toLowerCase()));
    }
    return collection;
  }

}
