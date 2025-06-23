import { Pipe, PipeTransform, inject } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeVideoLink',
    standalone: true
})
export class SafeVideoLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
