import { Component } from '@angular/core';
import { newEmptyJerseyOrder, JerseyCut, JerseySize } from '../../../src-common/models/jerseyorder';
import { ApiShopService } from '../../../src-common/services/bellumgens-api.shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  public order = newEmptyJerseyOrder();
  public promo = false;
  public inProgress = false;

  public cuts = [
    { text: 'Mъжка', cut: JerseyCut.Male },
    { text: 'Дамска', cut: JerseyCut.Female }
  ];

  public allSizes = [
    { text: 'XS', size: JerseySize.S },
    { text: 'S', size: JerseySize.S },
    { text: 'M', size: JerseySize.M },
    { text: 'L', size: JerseySize.L },
    { text: 'XL', size: JerseySize.XL },
    { text: 'XXL', size: JerseySize.XXL },
    { text: 'XXXL', size: JerseySize.XXXL }
  ];


  constructor(private apiService: ApiShopService,
              private router: Router) {
    const now = new Date();
    if (now > new Date(2020, 3, 11) && now < new Date(2020, 3, 13)) {
      this.promo = true;
    }
  }

  public placeOrder() {
    this.inProgress = true;
    this.apiService.submitOrder(this.order).subscribe(
      data => this.router.navigate(['order-success']),
      _ => this.inProgress = false
    );
  }

}
