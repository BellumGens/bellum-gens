import { Component, computed, inject, signal } from '@angular/core';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { BRAND_NAMES, Brand, PRODUCT_TYPE_NAMES, ProductType } from '../../../models/shop';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'bg-product-list',
  imports: [IgxChipComponent, IgxCircularProgressBarComponent, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private shopApi = inject(ApiShopService);

  public products = this.shopApi.products;
  public brand = signal<Brand | null>(null);
  public type = signal<ProductType | null>(null);

  public brands = [Brand.BellumGens, Brand.EBLeague, Brand.BGEStaraZagora];
  public brandNames = BRAND_NAMES;
  public typeNames = PRODUCT_TYPE_NAMES;

  public loading = computed(() => this.products() === null);

  public types = computed(() => {
    const present = new Set((this.products() ?? []).map(p => p.type));
    return [...present].sort((a, b) => a - b);
  });

  public filtered = computed(() => {
    const brand = this.brand();
    const type = this.type();
    return (this.products() ?? []).filter(p => (brand === null || p.brand === brand) && (type === null || p.type === type));
  });

  public selectBrand(brand: Brand | null, selected: boolean) {
    if (selected) {
      this.brand.set(brand);
    } else if (this.brand() === brand) {
      this.brand.set(null);
    }
  }

  public selectType(type: ProductType | null, selected: boolean) {
    if (selected) {
      this.type.set(type);
    } else if (this.type() === type) {
      this.type.set(null);
    }
  }
}
