import { Component, inject } from '@angular/core';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { CurrencyPipe } from '@angular/common';
import { Product, ProductOrderDetails } from '../../../models/order';

@Component({
  selector: 'bg-products',
  imports: [
    IGX_CARD_DIRECTIVES,
    CurrencyPipe
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private shopService = inject(ApiShopService);

  public products = this.shopService.products;

  public addToCart(product: Product) {
    const productOrderDetails: ProductOrderDetails = {
      product
    };
    if (product) {
      this.shopService.addToCart(productOrderDetails);
    }
  }
}
