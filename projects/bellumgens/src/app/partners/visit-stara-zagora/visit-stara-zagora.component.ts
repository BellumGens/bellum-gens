import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { IGX_CARD_DIRECTIVES, IgxFlexDirective, IgxIconButtonDirective, IgxIconComponent, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-visit-start-zagora',
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
  templateUrl: './visit-stara-zagora.component.html',
  styleUrl: './visit-stara-zagora.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitStaraZagoraComponent extends BaseDirective {
  public social = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com/visitstarazagora.bg'
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/visitstarazagora/'
    },
    {
      name: 'TikTok',
      icon: 'tiktok',
      url: 'https://www.tiktok.com/@visit.starazagora'
    }
  ];
}
