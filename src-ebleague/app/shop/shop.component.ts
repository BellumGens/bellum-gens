import { Component } from '@angular/core';
import { newEmptyJerseyOrder, JerseyCut, newEmptyJerseyDetails, JerseyDetails } from '../../../src-common/models/jerseyorder';
import { ApiShopService } from '../../../src-common/services/bellumgens-api.shop.service';
import { Router } from '@angular/router';
import { ISelectionEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  public order = newEmptyJerseyOrder();
  public promo = 0;
  public invalidPromo = false;
  public inProgress = false;

  public cuts = [
    { text: 'Mъжка', cut: JerseyCut.Male },
    { text: 'Дамска', cut: JerseyCut.Female }
  ];

  public newEmptyOrderDetails = newEmptyJerseyDetails;

  constructor(private apiService: ApiShopService,
              private router: Router) { }

  public placeOrder() {
    this.inProgress = true;
    this.apiService.submitOrder(this.order).subscribe(
      data => this.router.navigate(['order-success']),
      _ => this.inProgress = false
    );
  }

  public checkForPromo() {
    this.apiService.checkForPromo(this.order.promocode).subscribe(data => {
      if (data) {
        this.promo = data.discount;
        this.invalidPromo = false;
      } else {
        this.order.promocode = null;
        this.invalidPromo = true;
      }
    });
  }

  public selectJerseyCut(jersey: JerseyDetails, event: ISelectionEventArgs) {
    jersey.cut = event.newSelection.value;
  }

  public selectJerseySize(jersey: JerseyDetails, event: ISelectionEventArgs) {
    jersey.size = event.newSelection.value;
  }

}
