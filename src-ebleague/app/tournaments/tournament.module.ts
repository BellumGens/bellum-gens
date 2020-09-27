import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TournamentRoutingModule } from './tournament-routing.module';
import { TournamentComponent } from './tournament.component';
import { TournamentFormatComponent } from './tournament-format/tournament-format.component';
import { TournamentCsgoComponent } from './tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournament-sc2/tournament-sc2.component';
import { BaseComponent } from '../../../src-bellumgens/app/base/base.component';
import { ProductionCrewComponent } from './production-crew/production-crew.component';
import { SortByPointsPipe } from '../pipes/sort-by-points.pipe';
import { BellumGensModule } from '../../../src-common/components/components.module';

import {
  IgxDividerModule,
  IgxButtonModule,
  IgxCardModule,
  IgxInputGroupModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxProgressBarModule,
  IgxBadgeModule,
  IgxCalendarModule,
  IgxGridModule
} from '@infragistics/igniteui-angular';


@NgModule({
  declarations: [
    TournamentComponent,
    TournamentFormatComponent,
    TournamentCsgoComponent,
    TournamentSc2Component,
    ProductionCrewComponent,
    BaseComponent,
    SortByPointsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    TournamentRoutingModule,
    IgxDividerModule,
    IgxButtonModule,
    IgxCardModule,
    IgxInputGroupModule,
    IgxAvatarModule,
    IgxIconModule,
    IgxProgressBarModule,
    IgxBadgeModule,
    IgxCalendarModule,
    IgxGridModule,
    BellumGensModule
  ]
})
export class TournamentModule { }
