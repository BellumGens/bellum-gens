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
import { TruncateTextPipe } from '../pipes/truncate-text.pipe';
import { SafeVideoLinkPipe } from '../pipes/safe-video-link.pipe';
import { IsVideoPipe } from '../pipes/is-video.pipe';
import { HasVotedPipe } from '../pipes/has-voted.pipe';
import { VotesPipe } from '../pipes/votes.pipe';
import { IsStratOwnerPipe } from '../pipes/is-strat-owner.pipe';
import { SideStratsPipe } from '../pipes/sidestrats.pipe';

import { StratFilterPipe } from '../pipes/strat-filter.pipe';


@NgModule({
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
    IgxLayoutModule,
    IgxRadioModule,
    IgxDialogModule,
    IgxSwitchModule,
    IgxCheckboxModule,
    StrategiesComponent,
    StrategyDetailsComponent,
    NewStrategyComponent,
    StrategyEditorComponent,
    TruncateTextPipe,
    SafeVideoLinkPipe,
    IsVideoPipe,
    HasVotedPipe,
    VotesPipe,
    IsStratOwnerPipe,
    SideStratsPipe,
    StratFilterPipe
]
})
export class StrategiesModule { }
