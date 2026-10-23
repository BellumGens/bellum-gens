import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
    name: 'startsWith'
})
export class StartsWithPipe implements PipeTransform {

  public transform(collection: string[], term?: string | null): string[] {
    if (collection) {
      const prefix = (term ?? '').toLowerCase();
      return collection.filter((item) => item.toLowerCase().startsWith(prefix));
    }
    return collection;
  }

}
