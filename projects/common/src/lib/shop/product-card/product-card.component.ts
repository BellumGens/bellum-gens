import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { CartService } from 'bellum-gens-common/services';
import { BRAND_NAMES, Product, ProductVariant, effectivePrice, isSoldOut } from 'bellum-gens-common/models';

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
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  private cart = inject(CartService);

  public product = input.required<Product>();

  public brandName = computed(() => BRAND_NAMES[this.product().brand]);
  /** Options a customer can pick: in-stock active variants, or every active one when all are sold out. */
  private pricedVariants = computed(() => {
    const product = this.product();
    const active = (product.variants ?? []).filter(v => v.active);
    const inStock = active.filter(v => !isSoldOut(product, v));
    return inStock.length ? inStock : active;
  });
  /** The cheapest option, whose price is advertised as the starting price. */
  private cheapestVariant = computed(() => {
    const product = this.product();
    return this.pricedVariants().reduce<ProductVariant | null>(
      (cheapest, v) => !cheapest || effectivePrice(product, v) < effectivePrice(product, cheapest) ? v : cheapest, null);
  });
  public price = computed(() => effectivePrice(this.product(), this.cheapestVariant()));
  /** The price before the product discount, shown struck through. */
  public regularPrice = computed(() => this.cheapestVariant()?.priceOverride ?? this.product().price);
  /** Options are priced differently, so the shown price is only a starting point. */
  public priceVaries = computed(() => {
    const product = this.product();
    return new Set(this.pricedVariants().map(v => effectivePrice(product, v))).size > 1;
  });
  public hasDiscount = computed(() => (this.product().discountPercentage ?? 0) > 0);
  public soldOut = computed(() => isSoldOut(this.product()));
  public hasOptions = computed(() => (this.product().variants?.length ?? 0) > 0);

  public addToCart() {
    if (!this.hasOptions() && !this.soldOut()) {
      this.cart.add(this.product());
    }
  }
}
