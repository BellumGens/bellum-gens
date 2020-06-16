import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentRoutingModule } from './tournament-routing.module';
import { TournamentComponent } from './tournament.component';
import { TournamentFormatComponent } from './tournament-format/tournament-format.component';
import { IgxDividerModule,
  IgxButtonModule,
  IgxSelectModule,
  IgxCardModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxDialogModule,
  IgxAutocompleteModule,
  IgxDropDownModule,
  IgxCheckboxModule,
  IgxProgressBarModule,
  IgxBadgeModule,
  IgxCalendarModule,
  IgxGridModule} from '@infragistics/igniteui-angular';
import { TournamentCsgoComponent } from './tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournament-sc2/tournament-sc2.component';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../src-bellumgens/app/base/base.component';
import { ProductionCrewComponent } from './production-crew/production-crew.component';
import { SortByPointsPipe } from '../pipes/sort-by-points.pipe';
import { CSGOTournamentScheduleComponent } from './tournament-schedule/csgo/tournament-schedule.component';
import { SC2TournamentScheduleComponent } from './tournament-schedule/sc2/tournament-schedule.component';
import { BellumGensModule } from '../../../src-common/components/components.module';
import { Sc2MapNamePipe } from '../pipes/sc2-map-name.pipe';


@NgModule({
  declarations: [
    TournamentComponent,
    TournamentFormatComponent,
    TournamentCsgoComponent,
    TournamentSc2Component,
    ProductionCrewComponent,
    CSGOTournamentScheduleComponent,
    SC2TournamentScheduleComponent,
    BaseComponent,
    SortByPointsPipe,
    Sc2MapNamePipe
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
