import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { EMPTY_JERSEY_ORDER, JerseyCut, JerseyDetails, JerseySize, ApiShopService } from '../../../../common/src/public_api';
import { Router, ActivatedRoute } from '@angular/router';
import { ISelectionEventArgs, IgxSelectModule, IgxInputGroupModule, IgxIconModule, IgxDividerModule, IgxButtonModule, IgxMaskModule, IgxTextSelectionModule } from '@infragistics/igniteui-angular';
import { BaseComponent } from '../../../../bellumgens/src/app/base/base.component';
import { FilterSizesPipe } from '../pipes/filter-sizes.pipe';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
    standalone: true,
    imports: [
      NgOptimizedImage,
      NgIf,
      FormsModule,
      NgFor,
      IgxSelectModule,
      IgxInputGroupModule,
      IgxIconModule,
      IgxDividerModule,
      IgxButtonModule,
      IgxMaskModule,
      IgxTextSelectionModule,
      FilterSizesPipe
    ]
})
export class ShopComponent extends BaseComponent {
  public order = Object.assign({}, EMPTY_JERSEY_ORDER);
  public basePromo = .3;
  public promo = this.basePromo;
  public invalidPromo = false;
  public inProgress = false;
  public basePrice = 60;
  public countryCode = '+359';

  public cuts = [
    { text: $localize`Male`, cut: JerseyCut.Male },
    { text: $localize`Female`, cut: JerseyCut.Female }
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
      () => this.router.navigate(['shop', 'order-success']),
      () => this.inProgress = false
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
