import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IgxAvatarModule,
  IgxBadgeModule,
  IgxButtonGroupModule,
  IgxButtonModule,
  IgxCardModule,
  IgxCheckboxModule,
  IgxChipsModule,
  IgxDialogModule,
  IgxDividerModule,
  IgxDragDropModule,
  IgxDropDownModule,
  IgxIconModule,
  IgxLayoutModule,
  IgxListModule,
  IgxRadioModule,
  IgxRippleModule,
  IgxSelectModule,
  IgxSwitchModule,
  IgxToggleModule
} from '@infragistics/igniteui-angular';

import { StrategiesRoutingModule } from './strategies-routing.module';
import { StrategiesComponent } from './strategies.component';
import { StrategyDetailsComponent } from './strategy-details/strategy-details.component';
import { NewStrategyComponent } from './new-strategy/new-strategy.component';
import { StrategyEditorComponent } from './strategy-editor/strategy-editor.component';
import { UserStrategiesComponent } from './user-strategies/user-strategies.component';
import { TruncateTextPipe } from '../pipes/truncate-text.pipe';
import { SafeVideoLinkPipe } from '../pipes/safe-video-link.pipe';
import { IsVideoPipe } from '../pipes/is-video.pipe';
import { HasVotedPipe } from '../pipes/has-voted.pipe';
import { VotesPipe } from '../pipes/votes.pipe';
import { IsStratOwnerPipe } from '../pipes/is-strat-owner.pipe';
import { SideStratsPipe } from '../pipes/sidestrats.pipe';
import { BellumGensModule, ConfirmModule, LoadingModule } from '../../../src-common/lib/public_api';


@NgModule({
  declarations: [
    StrategiesComponent,
    StrategyDetailsComponent,
    NewStrategyComponent,
    StrategyEditorComponent,
    UserStrategiesComponent,
    TruncateTextPipe,
    SafeVideoLinkPipe,
    IsVideoPipe,
    HasVotedPipe,
    VotesPipe,
    IsStratOwnerPipe,
    SideStratsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    StrategiesRoutingModule,
    IgxCardModule,
    IgxAvatarModule,
    IgxIconModule,
    IgxBadgeModule,
    IgxButtonModule,
    IgxRippleModule,
    IgxButtonGroupModule,
    IgxDragDropModule,
    IgxSelectModule,
    IgxListModule,
    IgxDropDownModule,
    IgxToggleModule,
    IgxDividerModule,
    IgxChipsModule,
    IgxLayoutModule, // TODO: REMOVE
    IgxRadioModule,
    IgxDialogModule,
    IgxSwitchModule,
    IgxCheckboxModule,
    ConfirmModule,
    LoadingModule,
    BellumGensModule
  ]
})
export class StrategiesModule { }
