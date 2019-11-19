import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxListModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxDatePickerModule,
  IgxDialogModule,
  IgxButtonModule,
  IgxProgressBarModule,
  IgxBadgeModule,
  IgxCardModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxDropDownModule,
  IgxCheckboxModule,
  IgxToggleModule,
  IgxDragDropModule,
  IgxTabsModule,
  IgxCalendarModule,
  IgxExpansionPanelModule,
  IgxRadioModule,
  IgxSnackbarModule,
  IgxBannerModule,
  IgxButtonGroupModule,
  IgxIconService,
  IgxSliderModule,
  IgxSwitchModule,
  IgxSelectModule,
  IgxDividerModule,
  IgxCarouselModule,
  IgxAutocompleteModule} from 'igniteui-angular';
import { LoginService } from '../../src-common/services/login.service';
import { BellumgensApiService } from '../../src-common/services/bellumgens-api.service';
import { SuccessErrorComponent } from '../../src-bellumgens/app/success-error/success-error.component';
import { ConfirmComponent } from '../../src-bellumgens/app/confirm/confirm.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../src-common/environments/environment';
import { TournamentHomeComponent } from './home/tournament-home.component';
import { ApiTournamentsService } from '../../src-common/services/bellumgens-api.tournaments.service';
import { TeamNewComponent } from '../../src-bellumgens/app/team-section/team-new/team-new.component';
import { TournamentFormatComponent } from './tournaments/tournament-format/tournament-format.component';
import { LoginDialogComponent } from '../../src-bellumgens/app/login/login-dialog/login-dialog.component';
import { NotificationsComponent } from '../../src-bellumgens/app/notifications/notifications.component';
import { TeamNavComponent } from '../../src-bellumgens/app/team-section/team-nav/team-nav.component';
import { LoginComponent } from '../../src-bellumgens/app/login/login.component';
import { QuickSearchComponent } from '../../src-bellumgens/app/search/quick-search/quick-search.component';
import { GetRegCountPipe } from '../../src-bellumgens/app/pipes/get-reg-count.pipe';
import { StartsWithPipe } from '../../src-bellumgens/app/pipes/starts-with.pipe';
import { GroupsFilterPipe } from '../../src-bellumgens/app/pipes/groups-filter.pipe';
import { UserPreferencesComponent } from '../../src-bellumgens/app/player-section/user-preferences/user-preferences.component';
import { PlayerNotificationsComponent } from '../../src-bellumgens/app/player-section/notifications/notifications.component';
import { TeamNotificationsComponent } from '../../src-bellumgens/app/team-section/team-notifications/team-notifications.component';
import { ReduceQuickSearchResultPipe } from '../../src-bellumgens/app/pipes/reduce-quick-search-result.pipe';
import { PlayerCountryPipe } from '../../src-bellumgens/app/pipes/player-country.pipe';
import { SortNotificationsPipe } from '../../src-bellumgens/app/pipes/sort-notifications.pipe';
import { DisabledNotificationsPipe } from '../../src-bellumgens/app/pipes/disabled-notifications.pipe';
import { NotificationStatePipe } from '../../src-bellumgens/app/pipes/notification-state.pipe';
import { SortApplicationsPipe } from '../../src-bellumgens/app/pipes/sort-applications.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SuccessErrorComponent,
    ConfirmComponent,
    TournamentHomeComponent,
    TeamNewComponent,
    TournamentFormatComponent,
    LoginComponent,
    LoginDialogComponent,
    NotificationsComponent,
    TeamNavComponent,
    QuickSearchComponent,
    UserPreferencesComponent,
    PlayerNotificationsComponent,
    TeamNotificationsComponent,
    GetRegCountPipe,
    StartsWithPipe,
    GroupsFilterPipe,
    ReduceQuickSearchResultPipe,
    PlayerCountryPipe,
    SortNotificationsPipe,
    DisabledNotificationsPipe,
    NotificationStatePipe,
    SortApplicationsPipe
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    IgxAvatarModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxListModule,
    IgxIconModule,
    IgxDialogModule,
    IgxInputGroupModule,
    IgxDatePickerModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxBadgeModule,
    IgxCardModule,
    IgxChipsModule,
    IgxTimePickerModule,
    IgxDropDownModule,
    IgxCheckboxModule,
    IgxDragDropModule,
    IgxTabsModule,
    IgxCalendarModule,
    IgxExpansionPanelModule,
    IgxRadioModule,
    IgxSnackbarModule,
    IgxBannerModule,
    IgxButtonGroupModule,
    IgxSliderModule,
    IgxProgressBarModule,
    IgxSwitchModule,
    IgxSelectModule,
    IgxDividerModule,
    IgxCarouselModule,
    IgxAutocompleteModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    LoginService,
    BellumgensApiService,
    ApiTournamentsService,
    IgxIconService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconService: IgxIconService) {
    this.iconService.addSvgIcon('Twitch', '/assets/login/Glitch_White_RGB.svg', 'login-icons');
    this.iconService.addSvgIcon('TwitchFull', '/assets/login/Combo_White_RGB.svg', 'login-icons');
    this.iconService.addSvgIcon('Steam', '/assets/login/steam-logo-white.svg', 'login-icons');
    this.iconService.addSvgIcon('Facebook', '/assets/login/fb.svg', 'login-icons');
    this.iconService.addSvgIcon('Twitter', '/assets/login/twitter.svg', 'login-icons');
    this.iconService.addSvgIcon('BattleNet', '/assets/login/battle-net.svg', 'login-icons');
  }
}
