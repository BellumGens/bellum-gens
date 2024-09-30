import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { IGX_CARD_DIRECTIVES, IgxFlexDirective, IgxIconButtonDirective, IgxIconComponent, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular';
import { NgOptimizedImage } from '@angular/common';

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
  ]
}
