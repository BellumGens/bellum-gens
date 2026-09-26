import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxFlexDirective, IgxIconButtonDirective, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { Data } from '@angular/router';
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
  host: {
    '(window:resize)': 'resize()'
  }
})
export class PartnerComponent extends BaseDirective {
  private platformId = inject(PLATFORM_ID);

  private data = toSignal(this.activeRoute.data, { initialValue: {} as Data });

  public social = computed<SocialMedia []>(() => this.data().social);
  public image = computed<string>(() => this.data().partnerImage);
  public name = computed<string>(() => this.data().name);
  public url = computed<string>(() => this.data().url);
  public expose = computed<string []>(() => this.data().expose);

  public horizontal = signal(true);
  public mediaWidth = computed(() => this.horizontal() ? '550px' : '100%');

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.resize();
    }
  }

  public resize() {
    this.horizontal.set(window.matchMedia('(min-width: 1024px)').matches);
  }
}
