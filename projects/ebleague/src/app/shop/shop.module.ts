import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { FilterSizesPipe } from '../pipes/filter-sizes.pipe';

import {
  IgxSelectModule,
  IgxInputGroupModule,
  IgxIconModule,
  IgxButtonModule,
  IgxMaskModule,
  IgxDividerModule,
  IgxTextSelectionModule
} from '@infragistics/igniteui-angular';


@NgModule({
  declarations: [
    ShopComponent,
    OrderSuccessComponent,
    FilterSizesPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShopRoutingModule,
    IgxSelectModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxButtonModule,
    IgxMaskModule,
    IgxDividerModule,
    IgxTextSelectionModule
  ]
})
export class ShopModule { }
