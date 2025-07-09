import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ISelectionEventArgs, IGX_SELECT_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IgxIconComponent, IgxDividerDirective, IgxButtonDirective, IgxMaskDirective, IgxTextSelectionDirective } from '@infragistics/igniteui-angular';
import { FilterSizesPipe } from '../../pipes/filter-sizes.pipe';
import { ApiShopService } from '../../../public_api';
import { EMPTY_JERSEY_ORDER, JerseyCut, ProductOrderDetails, Order, JerseySize } from '../../../models/order';

@Component({
  selector: 'bg-orderform',
  templateUrl: './orderform.component.html',
  styleUrls: ['./orderform.component.scss'],
  imports: [
    FormsModule,
    IGX_SELECT_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    IgxDividerDirective,
    IgxButtonDirective,
    IgxMaskDirective,
    IgxTextSelectionDirective,
    FilterSizesPipe
  ]
})
export class OrderformComponent {
  private apiService = inject(ApiShopService);

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

  @Output()
  public orderSuccess = new EventEmitter<Order>();

  public placeOrder() {
    this.inProgress = true;
    this.apiService.submitOrder(this.order).subscribe({
      next: () => this.orderSuccess.emit(this.order),
      complete: () => this.inProgress = false
    });
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

  public selectJerseyCut(jersey: ProductOrderDetails, event: ISelectionEventArgs) {
    jersey.cut = event.newSelection.value;
  }

  public selectJerseySize(jersey: ProductOrderDetails, event: ISelectionEventArgs) {
    jersey.size = event.newSelection.value;
  }

}
