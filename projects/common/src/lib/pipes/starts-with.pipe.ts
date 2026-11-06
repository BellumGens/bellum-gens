import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
    name: 'startsWith'
})
export class StartsWithPipe implements PipeTransform {

  public transform(collection: string[], term?: string | null): string[];
  public transform<T extends null | undefined>(collection: string[] | T, term?: string | null): string[] | T;
  public transform(collection: string[] | null | undefined, term?: string | null): string[] | null | undefined {
    if (collection) {
      const prefix = (term ?? '').toLowerCase();
      return collection.filter((item) => item.toLowerCase().startsWith(prefix));
    }
    return collection;
  }

}
