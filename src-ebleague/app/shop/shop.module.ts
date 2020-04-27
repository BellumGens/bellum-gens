import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { IgxSelectModule,
  IgxInputGroupModule,
  IgxIconModule,
  IgxButtonModule,
  IgxMaskModule,
  IgxDividerModule,
  IgxTextSelectionModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { FilterSizesPipe } from '../pipes/filter-sizes.pipe';


@NgModule({
  declarations: [ShopComponent, FilterSizesPipe],
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
