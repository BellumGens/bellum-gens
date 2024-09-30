import { ChangeDetectionStrategy, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { IGX_CARD_DIRECTIVES, IgxIconButtonDirective, IgxRippleDirective, IgxIconComponent, IgxLayoutDirective, IgxFlexDirective } from '@infragistics/igniteui-angular';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bulstream',
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
  templateUrl: './bulstream.component.html',
  styleUrl: './bulstream.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulstreamComponent extends BaseDirective {
  public social = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com/bulstream'
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/bulstreamcom/'
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://www.linkedin.com/company/bulstream'
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
