import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
export class ShopComponent extends BaseDirective implements OnInit {
  private router = inject(Router);
  @ViewChild(OrderformComponent, { static: true })
  public orderForm: OrderformComponent;

  public basePromo = .3;
  public basePrice = 60;

  public ngOnInit(): void {
    this.orderForm.orderSuccess.subscribe(() => {
      this.router.navigate(['shop', 'order-success']);
    });
  }
}
