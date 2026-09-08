import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'bg-cart-badge',
  imports: [RouterLink, IgxIconComponent, IgxBadgeComponent],
  template: `
    <a class="cart-badge navigatable" routerLink="/shop/cart" i18n-title title="Cart" i18n-aria-label aria-label="Cart">
      <igx-icon>shopping_cart</igx-icon>
      @if (cart.count() > 0) {
        <igx-badge [value]="cart.count()" type="info"></igx-badge>
      }
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .cart-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: inherit;
    }

    igx-badge {
      position: absolute;
      top: 0;
      right: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartBadgeComponent {
  public cart = inject(CartService);
}
