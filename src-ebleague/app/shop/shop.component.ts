import { Component } from '@angular/core';
import { newEmptyJerseyOrder, JerseyCut, JerseyDetails, JerseySize } from '../../../src-common/models/jerseyorder';
import { ApiShopService } from '../../../src-common/services/bellumgens-api.shop.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ISelectionEventArgs } from '@infragistics/igniteui-angular';
import { BaseComponent } from '../../../src-bellumgens/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent extends BaseComponent {
  public order = newEmptyJerseyOrder();
  public basePromo = .5;
  public promo = this.basePromo;
  public invalidPromo = false;
  public inProgress = false;
  public basePrice = 60;

  public cuts = [
    { text: 'Mъжка', cut: JerseyCut.Male },
    { text: 'Дамска', cut: JerseyCut.Female }
  ];

  public allSizes: [
    { text: 'XS'; size: JerseySize.XS; disabled: false },
    { text: 'S'; size: JerseySize.S; disabled: false },
    { text: 'M'; size: JerseySize.M; disabled: false },
    { text: 'L'; size: JerseySize.L; disabled: false },
    { text: 'XL'; size: JerseySize.XL; disabled: false },
    { text: 'XXL'; size: JerseySize.XXL; disabled: false },
    { text: 'XXXL'; size: JerseySize.XXXL; disabled: false }
  ];

  constructor(private apiService: ApiShopService,
              private router: Router,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
  }

  public placeOrder() {
    this.inProgress = true;
    this.apiService.submitOrder(this.order).subscribe(
      _ => this.router.navigate(['shop', 'order-success']),
      _ => this.inProgress = false
    );
  }

  public checkForPromo() {
    if (this.order.promoCode) {
      this.apiService.checkForPromo(this.order.promoCode).subscribe(data => {
        if (data) {
          this.promo = this.basePromo + data.discount;
          this.invalidPromo = false;
        } else {
          this.order.promoCode = null;
          this.invalidPromo = true;
        }
      });
    }
  }

  public selectJerseyCut(jersey: JerseyDetails, event: ISelectionEventArgs) {
    jersey.cut = event.newSelection.value;
  }

  public selectJerseySize(jersey: JerseyDetails, event: ISelectionEventArgs) {
    jersey.size = event.newSelection.value;
  }

}
