import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminCsgoComponent } from './admin-csgo/admin-csgo.component';
import { BellumGensModule } from '../../../src-common/components/components.module';
import { AdminSc2Component } from './admin-sc2/admin-sc2.component';
import { NotInGroupPipe } from '../pipes/not-in-group.pipe';
import { GetPlayersPipe } from '../pipes/get-players.pipe';
import { SizeNamePipe } from '../pipes/size-name.pipe';

import {
  IgxChipsModule,
  IgxInputGroupModule,
  IgxListModule,
  IgxIconModule,
  IgxAvatarModule,
  IgxDatePickerModule,
  IgxButtonModule,
  IgxCardModule,
  IgxProgressBarModule,
  IgxBadgeModule,
  IgxDragDropModule,
  IgxSelectModule,
  IgxTimePickerModule,
  IgxCalendarModule,
  IgxDividerModule,
  IgxCheckboxModule,
  IgxGridModule,
  IgxDialogModule
} from '@infragistics/igniteui-angular';


@NgModule({
  declarations: [
    AdminComponent,
    AdminCsgoComponent,
    AdminSc2Component,
    NotInGroupPipe,
    GetPlayersPipe,
    SizeNamePipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    IgxChipsModule,
    IgxInputGroupModule,
    IgxListModule,
    IgxIconModule,
    IgxAvatarModule,
    IgxDatePickerModule,
    IgxButtonModule,
    IgxCardModule,
    IgxProgressBarModule,
    IgxBadgeModule,
    BellumGensModule,
    IgxDragDropModule,
    IgxSelectModule,
    IgxTimePickerModule,
    IgxCalendarModule,
    IgxCheckboxModule,
    IgxDividerModule,
    IgxDialogModule,
    IgxGridModule
  ]
})
export class AdminModule { }
