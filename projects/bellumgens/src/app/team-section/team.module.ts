import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IgxAvatarModule,
  IgxCardModule,
  IgxDialogModule,
  IgxDragDropModule,
  IgxGridModule,
  IgxInputGroupModule,
  IgxListModule,
  IgxSwitchModule,
  IgxTabsModule
} from '@infragistics/igniteui-angular';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';
import { TeamApplicationComponent } from './team-application/team-application.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamTournamentsComponent } from './team-tournaments/team-tournaments.component';
import { TeamNavComponent } from './team-nav/team-nav.component';
import { TeamNewComponent } from './team-new/team-new.component';
import { GroupsFilterPipe } from '../pipes/groups-filter.pipe';
import { TeamPreferencesComponent } from './team-preferences/team-preferences.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    TeamRoutingModule,
    IgxInputGroupModule,
    IgxDialogModule,
    IgxDragDropModule,
    IgxAvatarModule,
    IgxTabsModule,
    IgxGridModule,
    IgxCardModule,
    IgxListModule,
    IgxSwitchModule,
    TeamComponent,
    TeamApplicationComponent,
    TeamDetailsComponent,
    TeamTournamentsComponent,
    TeamNavComponent,
    TeamNewComponent,
    TeamPreferencesComponent,
    GroupsFilterPipe
]
})
export class TeamModule { }
