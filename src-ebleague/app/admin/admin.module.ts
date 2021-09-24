import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminCsgoComponent } from './admin-csgo/admin-csgo.component';
import { AdminSc2Component } from './admin-sc2/admin-sc2.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { NotInGroupPipe } from '../pipes/not-in-group.pipe';
import { GetPlayersPipe } from '../pipes/get-players.pipe';
import { SizeNamePipe } from '../pipes/size-name.pipe';

import { BellumGensModule, ConfirmModule } from '../../../src-common/lib/public_api';

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
  IgxDialogModule,
  IgxActionStripModule
} from '@infragistics/igniteui-angular';


@NgModule({
  declarations: [
    AdminComponent,
    AdminCsgoComponent,
    AdminSc2Component,
    NotInGroupPipe,
    GetPlayersPipe,
    SizeNamePipe,
    AdminMainComponent
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
    IgxDragDropModule,
    IgxSelectModule,
    IgxTimePickerModule,
    IgxCalendarModule,
    IgxCheckboxModule,
    IgxDividerModule,
    IgxDialogModule,
    IgxActionStripModule,
    IgxGridModule,
    ConfirmModule,
    BellumGensModule
  ]
})
export class AdminModule { }
