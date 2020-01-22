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
  IgxBadgeModule} from 'igniteui-angular';
import { TournamentRegistrationComponent } from './tournament-registration/tournament-registration.component';
import { TournamentCsgoComponent } from './tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournament-sc2/tournament-sc2.component';
import { FormsModule } from '@angular/forms';
import { TeamNewComponent } from '../../../src-bellumgens/app/team-section/team-new/team-new.component';
import { StartsWithPipe } from '../../../src-bellumgens/app/pipes/starts-with.pipe';
import { GroupsFilterPipe } from '../../../src-bellumgens/app/pipes/groups-filter.pipe';
import { BaseComponent } from '../../../src-bellumgens/app/base/base.component';
import { ProductionCrewComponent } from './production-crew/production-crew.component';


@NgModule({
  declarations: [
    TournamentComponent,
    TournamentFormatComponent,
    TournamentRegistrationComponent,
    TournamentCsgoComponent,
    TournamentSc2Component,
    ProductionCrewComponent,
    TeamNewComponent,
    StartsWithPipe,
    GroupsFilterPipe,
    BaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TournamentRoutingModule,
    IgxDividerModule,
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
    IgxBadgeModule
  ]
})
export class TournamentModule { }