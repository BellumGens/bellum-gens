import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

import { EMPTY_JERSEY_ORDER, JerseyCut, JerseyDetails, JerseySize, ApiShopService, OrderformComponent } from '../../../../common/src/public_api';
import { Router } from '@angular/router';
import { ISelectionEventArgs, IGX_SELECT_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IgxIconComponent, IgxDividerDirective, IgxButtonDirective, IgxMaskDirective, IgxTextSelectionDirective } from '@infragistics/igniteui-angular';
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
