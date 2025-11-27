import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { BaseDirective } from '../../../../bellumgens/src/app/base/base.component';
import { IgxCardModule } from '@infragistics/igniteui-angular';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    imports: [
      NgOptimizedImage,
      IgxCardModule
    ]
})
export class NewsComponent extends BaseDirective {
  private platformId = inject(PLATFORM_ID);

  public horizontal = true;

  constructor() {
    super();
    this.resize();
  }

  @HostListener('window:resize')
  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.horizontal = window.matchMedia('(min-width: 768px)').matches;
    }
  }
}
