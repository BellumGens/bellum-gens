import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { IgxChipsModule,
  IgxInputGroupModule,
  IgxListModule,
  IgxIconModule,
  IgxAvatarModule,
  IgxDatePickerModule,
  IgxButtonModule,
  IgxCardModule,
  IgxProgressBarModule,
  IgxBadgeModule} from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { AdminCsgoComponent } from './admin-csgo/admin-csgo.component';


@NgModule({
  declarations: [AdminComponent, AdminCsgoComponent],
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
    IgxBadgeModule
  ]
})
export class AdminModule { }
