import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { CartService } from '../../../services/cart.service';
import {
  BRAND_NAMES,
  JERSEY_CUT_NAMES,
  JERSEY_SIZE_NAMES,
  JerseyCut,
  JerseySize,
  Product,
  ProductVariant,
  effectivePrice,
  isSoldOut,
  variantStock
} from '../../../models/shop';

@Component({
  selector: 'bg-product-detail',
  imports: [
    CurrencyPipe,
    RouterLink,
    IGX_SELECT_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxChipComponent,
    IgxCircularProgressBarComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private shopApi = inject(ApiShopService);
  private cart = inject(CartService);
  private title = inject(Title);

  public product = signal<Product | null>(null);
  public notFound = signal(false);
  public image = signal<string | null>(null);
  public cut = signal<JerseyCut | null>(null);
  public size = signal<JerseySize | null>(null);
  public variantId = signal<string | null>(null);
  public quantity = signal(1);

  public brandNames = BRAND_NAMES;
  public cutNames = JERSEY_CUT_NAMES;
  public sizeNames = JERSEY_SIZE_NAMES;
  public maxQuantity = 10;

  public activeVariants = computed(() => (this.product()?.variants ?? []).filter(v => v.active));
  public hasVariants = computed(() => this.activeVariants().length > 0);
  /** Jersey style options: variants described by a cut and a size. */
  public hasCutAndSize = computed(() => this.activeVariants().some(v => v.cut !== null && v.cut !== undefined && v.size !== null && v.size !== undefined));

  public cuts = computed(() => {
    const cuts = new Set(this.activeVariants().map(v => v.cut).filter((c): c is JerseyCut => c !== null && c !== undefined));
    return [...cuts].sort((a, b) => a - b);
  });

  public sizes = computed(() => {
    const cut = this.cut();
    const sizes = new Set(this.activeVariants()
      .filter(v => cut === null || v.cut === cut)
      .map(v => v.size)
      .filter((s): s is JerseySize => s !== null && s !== undefined));
    return [...sizes].sort((a, b) => a - b);
  });

  public selectedVariant = computed<ProductVariant | null>(() => {
    const variants = this.activeVariants();
    if (this.hasCutAndSize()) {
      return variants.find(v => v.cut === this.cut() && v.size === this.size()) ?? null;
    }
    return variants.find(v => v.id === this.variantId()) ?? null;
  });

  public gallery = computed(() => {
    const product = this.product();
    if (!product) {
      return [] as string[];
    }
    return [product.imageUrl, ...(product.galleryUrls ?? [])].filter((url): url is string => !!url);
  });

  public price = computed(() => this.product() ? effectivePrice(this.product()!, this.selectedVariant()) : 0);
  public hasDiscount = computed(() => (this.product()?.discountPercentage ?? 0) > 0);
  public stock = computed(() => this.product() ? variantStock(this.product()!, this.selectedVariant()) : null);
  public soldOut = computed(() => {
    const product = this.product();
    if (!product) {
      return false;
    }
    const variant = this.selectedVariant();
    return variant ? isSoldOut(product, variant) : (!this.hasVariants() && isSoldOut(product));
  });
  public canAdd = computed(() => !!this.product() && !this.soldOut() && (!this.hasVariants() || !!this.selectedVariant()));

  constructor() {
    this.route.paramMap.pipe(
      switchMap(params => this.shopApi.getProduct(params.get('slug') ?? '')),
      takeUntilDestroyed()
    ).subscribe({
      next: product => this.show(product),
      error: () => this.notFound.set(true)
    });
  }

  public selectCut(event: ISelectionEventArgs) {
    this.cut.set(event.newSelection.value as JerseyCut);
    if (!this.sizes().includes(this.size() as JerseySize)) {
      this.size.set(this.sizes()[0] ?? null);
    }
  }

  public selectSize(event: ISelectionEventArgs) {
    this.size.set(event.newSelection.value as JerseySize);
  }

  public selectVariant(event: ISelectionEventArgs) {
    this.variantId.set(event.newSelection.value as string);
  }

  public sizeAvailable(size: JerseySize) {
    const variant = this.activeVariants().find(v => v.cut === this.cut() && v.size === size);
    return !!variant && (variant.stockQuantity === null || variant.stockQuantity === undefined || variant.stockQuantity > 0);
  }

  public changeQuantity(delta: number) {
    const max = this.stock() ?? this.maxQuantity;
    this.quantity.set(Math.min(Math.max(1, this.quantity() + delta), Math.max(1, Math.min(max, this.maxQuantity))));
  }

  public addToCart() {
    const product = this.product();
    if (product && this.canAdd()) {
      this.cart.add(product, this.selectedVariant(), this.quantity());
    }
  }

  private show(product: Product) {
    this.product.set(product);
    this.notFound.set(false);
    this.image.set(product.imageUrl ?? product.galleryUrls?.[0] ?? null);
    this.title.setTitle(`${product.name} | Bellum Gens Shop`);
    const variants = this.activeVariants();
    if (this.hasCutAndSize()) {
      this.cut.set(this.cuts()[0] ?? null);
      this.size.set(this.sizes()[0] ?? null);
    } else if (variants.length) {
      this.variantId.set(variants[0].id);
    }
    this.quantity.set(1);
  }
}
