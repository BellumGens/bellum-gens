import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective, IgxDividerComponent, IgxIconButtonDirective, IgxMaskDirective, IgxTextSelectionDirective } from '@infragistics/igniteui-angular/directives';
import { FilterSizesPipe, isJerseySizeAvailable, jerseySizes } from '../../pipes/filter-sizes.pipe';
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
    IgxDividerComponent,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxMaskDirective,
    IgxTextSelectionDirective,
    FilterSizesPipe
  ]
})
export class OrderformComponent {
  private apiService = inject(ApiShopService);

  public order = signal<Order>(structuredClone(EMPTY_JERSEY_ORDER));
  public basePromo = .3;
  public promo = signal(this.basePromo);
  public invalidPromo = signal(false);
  public inProgress = signal(false);
  public basePrice = 60;
  public countryCode = '+359';

  public productCount = computed(() => this.order().orderProducts.length);
  public subtotal = computed(() => this.productCount() * this.basePrice);
  public hasUnavailableJersey = computed(() => this.order().orderProducts.some(j => !isJerseySizeAvailable(j.cut, j.size)));

  public cuts = [
    { text: $localize`Male`, cut: JerseyCut.Male },
    { text: $localize`Female`, cut: JerseyCut.Female }
  ];

  public orderSuccess = output<Order>();

  public placeOrder() {
    if (this.hasUnavailableJersey()) {
      return;
    }
    this.inProgress.set(true);
    const order = this.order();
    this.apiService.submitOrder(order).subscribe({
      next: () => this.orderSuccess.emit(order),
      error: () => this.inProgress.set(false),
      complete: () => this.inProgress.set(false)
    });
  }

  public checkForPromo() {
    const promoCode = this.order().promoCode;
    if (promoCode) {
      this.apiService.checkForPromo(promoCode).subscribe(data => {
        if (data) {
          this.promo.set(this.basePromo + data.discount);
          this.invalidPromo.set(false);
        } else {
          this.updateOrder('promoCode', null);
          this.invalidPromo.set(true);
        }
      });
    }
  }

  public updateOrder<K extends keyof Order>(field: K, value: Order[K]) {
    this.order.update(order => ({ ...order, [field]: value }));
  }

  public addJersey() {
    const jersey = structuredClone(EMPTY_JERSEY_ORDER.orderProducts[0]);
    this.updateOrder('orderProducts', [...this.order().orderProducts, jersey]);
  }

  public removeJersey(index: number) {
    this.updateOrder('orderProducts', this.order().orderProducts.filter((_, i) => i !== index));
  }

  public selectJerseyCut(jersey: ProductOrderDetails, event: ISelectionEventArgs) {
    const cut: JerseyCut = event.newSelection.value;
    this.updateJersey(jersey, { cut, size: this.closestAvailableSize(cut, jersey.size) });
  }

  public selectJerseySize(jersey: ProductOrderDetails, event: ISelectionEventArgs) {
    this.updateJersey(jersey, { size: event.newSelection.value });
  }

  private closestAvailableSize(cut: JerseyCut, size: JerseySize): JerseySize {
    return jerseySizes(cut)
      .map(s => s.size)
      .reduce((closest, s) => Math.abs(s - size) < Math.abs(closest - size) ? s : closest);
  }

  private updateJersey(jersey: ProductOrderDetails, changes: Partial<ProductOrderDetails>) {
    this.updateOrder('orderProducts', this.order().orderProducts.map(j => j === jersey ? { ...j, ...changes } : j));
  }
}
