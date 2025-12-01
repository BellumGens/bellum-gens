import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxFlexDirective, IgxIconButtonDirective, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { SocialMedia } from '../../../../../common/src/public_api';
import { BaseDirective } from '../../base/base.component';

@Component({
  selector: 'app-partner',
  imports: [
    IGX_CARD_DIRECTIVES,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxLayoutDirective,
    IgxFlexDirective,
    NgOptimizedImage
  ],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerComponent extends BaseDirective {
  private platformId = inject(PLATFORM_ID);

  public social: SocialMedia [];
  public image: string;
  public name: string;
  public url: string;
  public expose: string [];

  public horizontal = true;
  public mediaWidth = '550px';

  constructor() {
    super();
    this.activeRoute.data.subscribe(data => {
      this.social = data.social;
      this.image = data.partnerImage;
      this.name = data.name;
      this.url = data.url;
      this.expose = data.expose;
    });
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
