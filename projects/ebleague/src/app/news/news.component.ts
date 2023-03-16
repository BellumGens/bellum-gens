import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../../bellumgens/src/app/base/base.component';
import { IgxCardModule } from '@infragistics/igniteui-angular';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    standalone: true,
    imports: [
      NgOptimizedImage,
      IgxCardModule
    ]
})
export class NewsComponent extends BaseComponent {
  public horizontal = true;

  constructor(@Inject(PLATFORM_ID) private platformId: any, title: Title, meta: Meta, route: ActivatedRoute) {
    super(title, meta, route);
    this.resize();
  }

  @HostListener('window:resize')
  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.horizontal = window.matchMedia('(min-width: 768px)').matches;
    }
  }
}
