import { Component } from '@angular/core';
import { newEmptyJerseyOrder, JerseyCut, JerseySize } from '../../../src-common/models/jerseyorder';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  public order = newEmptyJerseyOrder();
  public promo = true;
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


  constructor() {
    const now = new Date();
    if (now > new Date(2020, 3, 11) && now < new Date(2020, 3, 13)) {
      this.promo = true;
    }
  }

  public placeOrder() {
  }

}
