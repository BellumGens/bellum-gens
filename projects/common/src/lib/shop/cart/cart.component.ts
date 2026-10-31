import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
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
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  public cart = inject(CartService);

  public promoForm = new FormGroup({ code: new FormControl(this.cart.promoCode() ?? '', { nonNullable: true }) });
  public promoInput = this.promoForm.controls.code;
  public deliveryMethods = [DeliveryMethod.Courier, DeliveryMethod.EventPickup];
  public deliveryNames = DELIVERY_METHOD_NAMES;
  public maxQuantity = CartService.maxLineQuantity;
  public canCheckout = computed(() => !!this.cart.quote()?.isValid && !this.cart.quoting());

  /** The server's current price for a line, falling back to the price saved when the item was added. */
  public unitPrice(item: CartItem) {
    return this.quoteLine(item)?.unitPrice ?? effectivePrice(item.product, item.variant);
  }

  /** The server's verdict on a line, if any (sold out, option gone, quantity capped). */
  public problem(item: CartItem): string | null {
    return this.quoteLine(item)?.problem ?? null;
  }

  public applyPromo() {
    this.cart.setPromoCode(this.promoInput.value);
  }

  public clearPromo() {
    this.promoInput.setValue('');
    this.cart.setPromoCode(null);
  }

  public setDelivery(value: unknown) {
    this.cart.setDeliveryMethod(Number(value) as DeliveryMethod);
  }

  private quoteLine(item: CartItem) {
    return this.cart.quote()?.lines.find(l => l.productId === item.productId && (l.variantId ?? null) === (item.variantId ?? null));
  }
}
