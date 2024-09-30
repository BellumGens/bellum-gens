import { ChangeDetectionStrategy, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { IGX_CARD_DIRECTIVES, IgxFlexDirective, IgxIconButtonDirective, IgxIconComponent, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-techhub',
  standalone: true,
  imports: [
    IGX_CARD_DIRECTIVES,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxLayoutDirective,
    IgxFlexDirective,
    NgOptimizedImage
  ],
  templateUrl: './techhub.component.html',
  styleUrl: './techhub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechhubComponent extends BaseDirective {
  public social = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com/techhub.bg'
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/TechHub.bg'
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://www.linkedin.com/company/techhub-bg'
    },
    {
      name: 'TikTok',
      icon: 'tiktok',
      url: 'https://www.tiktok.com/@techhub.bg'
    }
  ];

  public horizontal = true;
  public mediaWidth = '550px';

  constructor(@Inject(PLATFORM_ID) private platformId: any, titleService: Title, meta: Meta, activeRoute: ActivatedRoute) {
    super(titleService, meta, activeRoute);

    if (isPlatformBrowser(this.platformId)) {
      this.resize();
    }
  }

  @HostListener('window:resize')
  public resize() {
    this.horizontal = window.matchMedia('(min-width: 1024px)').matches;
    if (!this.horizontal) {
      this.mediaWidth = '100%';
    } else {
      this.mediaWidth = '550px';
    }
  }
}
