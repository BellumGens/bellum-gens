import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxDividerComponent, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxRadioComponent, IgxRadioGroupDirective } from '@infragistics/igniteui-angular/radio';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { CartService } from '../../../services/cart.service';
import { CartItem, DELIVERY_METHOD_NAMES, DeliveryMethod, effectivePrice } from '../../../models/shop';

@Component({
  selector: 'bg-cart',
  imports: [
    CurrencyPipe,
    RouterLink,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IgxRadioComponent,
    IgxRadioGroupDirective,
    IgxCircularProgressBarComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  public cart = inject(CartService);

  public promoInput = signal(this.cart.promoCode() ?? '');
  public deliveryMethods = [DeliveryMethod.Courier, DeliveryMethod.EventPickup];
  public deliveryNames = DELIVERY_METHOD_NAMES;

  public unitPrice(item: CartItem) {
    return effectivePrice(item.product, item.variant);
  }

  /** The server's verdict on a line, if any (sold out, option gone, quantity capped). */
  public problem(item: CartItem): string | null {
    const line = this.cart.quote()?.lines.find(l => l.productId === item.productId && (l.variantId ?? null) === (item.variantId ?? null));
    return line?.problem ?? null;
  }

  public applyPromo() {
    this.cart.setPromoCode(this.promoInput());
  }

  public clearPromo() {
    this.promoInput.set('');
    this.cart.setPromoCode(null);
  }

  public setDelivery(value: unknown) {
    this.cart.setDeliveryMethod(Number(value) as DeliveryMethod);
  }
}
