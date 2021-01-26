import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  public transform(value: string, maxLength: number = 30): any {
    if (value && value.length > maxLength) {
      return value.substr(0, maxLength - 3) + '...';
    }
    return value;
  }

}
