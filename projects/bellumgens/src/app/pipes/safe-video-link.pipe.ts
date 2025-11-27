import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeVideoLink',
    standalone: true
})
export class SafeVideoLinkPipe implements PipeTransform {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private sanitizer: DomSanitizer) {}

  public transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
