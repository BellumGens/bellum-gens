import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { BaseDirective } from '../../../../bellumgens/src/app/base/base.component';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    host: {
      '(window:resize)': 'resize()'
    },
    imports: [
      NgOptimizedImage,
      IGX_CARD_DIRECTIVES
    ]
})
export class NewsComponent extends BaseDirective {
  private platformId = inject(PLATFORM_ID);

  public horizontal = signal(true);

  constructor() {
    super();
    this.resize();
  }

  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.horizontal.set(window.matchMedia('(min-width: 768px)').matches);
    }
  }
}
