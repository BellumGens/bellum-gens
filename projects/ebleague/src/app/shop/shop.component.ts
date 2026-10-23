import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { OrderformComponent } from '../../../../common/src/public_api';
import { Router } from '@angular/router';
import { BaseDirective } from '../../../../bellumgens/src/app/base/base.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [
    NgOptimizedImage,
    OrderformComponent
  ]
})
export class ShopComponent extends BaseDirective {
  private router = inject(Router);

  public basePromo = .3;
  public basePrice = 60;

  public onOrderSuccess() {
    this.router.navigate(['shop', 'order-success']);
  }
}
