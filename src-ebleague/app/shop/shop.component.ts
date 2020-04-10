import { Component, OnInit } from '@angular/core';
import { newEmptyJerseyOrder } from '../../../src-common/models/jerseyorder';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public order = newEmptyJerseyOrder();
  public promo = false;

  constructor() {
    const now = new Date();
    if (now > new Date(2020, 3, 11) && now < new Date(2020, 3, 13)) {
      this.promo = true;
    }
  }

  ngOnInit(): void {
  }

}
