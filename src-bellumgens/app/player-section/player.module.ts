import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IgxAvatarModule,
  IgxButtonModule,
  IgxCardModule,
  IgxCheckboxModule,
  IgxDropDownModule,
  IgxListModule,
  IgxProgressBarModule,
  IgxRippleModule,
  IgxSelectModule,
  IgxToggleModule
} from '@infragistics/igniteui-angular';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import { MapPoolComponent } from './map-pool/map-pool.component';
import { FormsModule } from '@angular/forms';
import { SteamCustomUrlPipe } from '../pipes/steam-custom-url.pipe';
import { BellumGensModule } from '../../../src-common/lib/components.module';
import { SortWeaponsPipe } from '../pipes/sort-weapons.pipe';
import { TopWeaponAltPipe } from '../pipes/top-weapon-alt.pipe';


@NgModule({
  declarations: [
    PlayerComponent,
    MapPoolComponent,
    SteamCustomUrlPipe,
    SortWeaponsPipe,
    TopWeaponAltPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlayerRoutingModule,
    IgxCardModule,
    IgxProgressBarModule,
    IgxButtonModule,
    IgxRippleModule,
    IgxSelectModule,
    IgxAvatarModule,
    IgxDropDownModule,
    IgxToggleModule,
    IgxListModule,
    IgxCheckboxModule,
    BellumGensModule
  ]
})
export class PlayerModule { }
