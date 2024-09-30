import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { NgOptimizedImage } from '@angular/common';
import { IGX_CARD_DIRECTIVES, IgxIconButtonDirective, IgxRippleDirective, IgxIconComponent, IgxLayoutDirective, IgxFlexDirective } from '@infragistics/igniteui-angular';

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
}
