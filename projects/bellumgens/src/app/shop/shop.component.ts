import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseDirective } from '../base/base.component';

/** Hosts the shop pages from the common library and applies the route's SEO metadata. */
@Component({
  selector: 'app-shop',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent extends BaseDirective {
}
