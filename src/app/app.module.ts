import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IgxNavigationDrawerModule,
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxListModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxFilterModule,
  IgxDatePickerModule,
  IgxDialogModule,
  IgxButtonModule,
  IgxProgressBarModule,
  IgxBadgeModule,
  IgxCardModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxToastModule,
  IgxDropDownModule,
  IgxCheckboxModule,
  IgxToggleModule,
  IgxDragDropModule,
  IgxTabsModule,
  IgxCalendarModule} from 'igniteui-angular';
import { PlayersComponent } from './players/players.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { LoginService } from './services/login.service';
import { BellumgensApiService } from './services/bellumgens-api.service';
import { TeamComponent } from './team-section/team/team.component';
import { HomeComponent } from './home/home.component';
import { TeamsComponent } from './team-section/teams/teams.component';
import { GroupsFilterPipe } from './pipes/groups-filter.pipe';
import { WeekdayPipe } from './pipes/weekday.pipe';
import { MapnamePipe } from './pipes/mapname.pipe';
import { MapimagePipe } from './pipes/mapimage.pipe';
import { OrdermapsPipe } from './pipes/ordermaps.pipe';
import { TeamDetailsComponent } from './team-section/team-details/team-details.component';
import { LoginComponent } from './login/login.component';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { SortNotificationsPipe } from './pipes/sort-notifications.pipe';
import { DisabledNotificationsPipe } from './pipes/disabled-notifications.pipe';
import { SuccessErrorComponent } from './success-error/success-error.component';
import { TeamStrategiesComponent } from './team-section/team-strategies/team-strategies.component';
import { TeamApplicationComponent } from './team-section/team-application/team-application.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { TeamNotificationsComponent } from './team-section/team-notifications/team-notifications.component';
import { SortApplicationsPipe } from './pipes/sort-applications.pipe';
import { TeamCalendarComponent } from './team-section/team-calendar/team-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlayerDetailsComponent,
    TeamComponent,
    HomeComponent,
    TeamsComponent,
    GroupsFilterPipe,
    WeekdayPipe,
    MapnamePipe,
    MapimagePipe,
    OrdermapsPipe,
    TeamDetailsComponent,
    LoginComponent,
    UnreadNotificationsPipe,
    NotificationsComponent,
    SortNotificationsPipe,
    DisabledNotificationsPipe,
    SuccessErrorComponent,
    TeamStrategiesComponent,
    TeamApplicationComponent,
    TeamOverviewComponent,
    TeamNotificationsComponent,
    TeamCalendarComponent,
    SortApplicationsPipe
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IgxAvatarModule,
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxListModule,
    IgxIconModule,
    IgxDialogModule,
    IgxInputGroupModule,
    IgxFilterModule,
    IgxDatePickerModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxBadgeModule,
    IgxCardModule,
    IgxChipsModule,
    IgxTimePickerModule,
    IgxToastModule,
    IgxDropDownModule,
    IgxCheckboxModule,
    IgxDragDropModule,
    IgxTabsModule,
    IgxCalendarModule,
    IgxProgressBarModule
  ],
  providers: [
    LoginService,
    BellumgensApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
