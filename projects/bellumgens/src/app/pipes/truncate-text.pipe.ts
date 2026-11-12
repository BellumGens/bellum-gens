import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  public transform<T extends string | null | undefined>(value: T, maxLength: number = 30): T | string {
    if (value && value.length > maxLength) {
      return value.substr(0, maxLength - 3) + '...';
    }
    return value;
  }

}
