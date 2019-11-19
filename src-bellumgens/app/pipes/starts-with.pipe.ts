import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'startsWith'
})
export class StartsWithPipe implements PipeTransform {

  transform(collection: string[], term = ''): string[] {
    if (collection) {
      return collection.filter((item) => item.toLowerCase().startsWith(term.toLowerCase()));
    }
    return collection;
  }

}
