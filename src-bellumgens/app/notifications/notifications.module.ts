import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { PlayerNotificationsComponent } from './player-notifications/player-notifications.component';
import { TeamNotificationsComponent } from './team-notifications/team-notifications.component';
import { DisabledNotificationsPipe } from '../pipes/disabled-notifications.pipe';
import { SortNotificationsPipe } from '../pipes/sort-notifications.pipe';
import { SortApplicationsPipe } from '../pipes/sort-applications.pipe';
import { IgxAvatarModule, IgxButtonModule, IgxListModule, IgxRippleModule } from '@infragistics/igniteui-angular';
import { NotificationStatePipe } from '../pipes/notification-state.pipe';


@NgModule({
  declarations: [
    NotificationsComponent,
    PlayerNotificationsComponent,
    TeamNotificationsComponent,
    DisabledNotificationsPipe,
    SortNotificationsPipe,
    SortApplicationsPipe,
    NotificationStatePipe
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    IgxAvatarModule,
    IgxListModule,
    IgxButtonModule,
    IgxRippleModule
  ]
})
export class NotificationsModule { }
