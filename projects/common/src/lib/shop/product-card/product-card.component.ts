import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { CartService } from '../../../services/cart.service';
import { BRAND_NAMES, Product, effectivePrice, isSoldOut } from '../../../models/shop';

@Component({
  selector: 'bg-product-card',
  imports: [
    CurrencyPipe,
    RouterLink,
    IGX_CARD_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxChipComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  private cart = inject(CartService);

  public product = input.required<Product>();

  public brandName = computed(() => BRAND_NAMES[this.product().brand]);
  public price = computed(() => effectivePrice(this.product()));
  public hasDiscount = computed(() => (this.product().discountPercentage ?? 0) > 0);
  public soldOut = computed(() => isSoldOut(this.product()));
  public hasOptions = computed(() => (this.product().variants?.length ?? 0) > 0);

  public addToCart() {
    if (!this.hasOptions() && !this.soldOut()) {
      this.cart.add(this.product());
    }
  }
}
