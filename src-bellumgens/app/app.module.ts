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
import { PlayerDetailsComponent } from './player-section/player-details/player-details.component';
import { LoginService } from '../../src-common/services/login.service';
import { BellumgensApiService } from '../../src-common/services/bellumgens-api.service';
import { HomeComponent } from './home/home.component';
import { GroupsFilterPipe } from './pipes/groups-filter.pipe';
import { WeekdayPipe } from './pipes/weekday.pipe';
import { MapnamePipe } from './pipes/mapname.pipe';
import { MapimagePipe } from './pipes/mapimage.pipe';
import { TeamDetailsComponent } from './team-section/team-details/team-details.component';
import { LoginComponent } from './login/login.component';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { PlayerNotificationsComponent } from './player-section/notifications/notifications.component';
import { SortNotificationsPipe } from './pipes/sort-notifications.pipe';
import { DisabledNotificationsPipe } from './pipes/disabled-notifications.pipe';
import { SuccessErrorComponent } from './success-error/success-error.component';
import { TeamStrategiesComponent } from './team-section/team-strategies/team-strategies.component';
import { TeamApplicationComponent } from './team-section/team-application/team-application.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { TeamNotificationsComponent } from './team-section/team-notifications/team-notifications.component';
import { SortApplicationsPipe } from './pipes/sort-applications.pipe';
import { MapPoolComponent } from './map-pool/map-pool.component';
import { SideStratsPipe } from './pipes/sidestrats.pipe';
import { AvailabilityComponent } from './availability/availability.component';
import { SafeVideoLinkPipe } from './pipes/safe-video-link.pipe';
import { TeamNavComponent } from './team-section/team-nav/team-nav.component';
import { TeamSearchComponent } from './search/team-search/team-search.component';
import { PlayerSearchComponent } from './search/player-search/player-search.component';
import { SearchComponent } from './search/search/search.component';
import { SteamCustomUrlPipe } from './pipes/steam-custom-url.pipe';
import { PlayerCountryPipe } from './pipes/player-country.pipe';
import { TopWeaponAltPipe } from './pipes/top-weapon-alt.pipe';
import { QuickSearchComponent } from './search/quick-search/quick-search.component';
import { ReduceQuickSearchResultPipe } from './pipes/reduce-quick-search-result.pipe';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DaysAvailablePipe } from './pipes/days-available.pipe';
import { OpenPositionsPipe } from './pipes/open-positions.pipe';
import { TeamPreferencesComponent } from './team-section/team-preferences/team-preferences.component';
import { SortWeaponsPipe } from './pipes/sort-weapons.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../src-common/environments/environment';
import { ExcludeMembersPipe } from './pipes/exclude-members.pipe';
import { UserPreferencesComponent } from './player-section/user-preferences/user-preferences.component';
import { NotificationStatePipe } from './pipes/notification-state.pipe';
import { EmailconfirmComponent } from './emailconfirm/emailconfirm.component';
import { QueryParsedPipe } from './pipes/query-parsed.pipe';
import { StrategyEditorComponent } from './team-section/team-strategies/strategy-editor/strategy-editor.component';
import { ActiveDutyMapsPipe } from './pipes/active-duty-maps.pipe';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AddSteamComponent } from './add-steam/add-steam.component';
import { BaseComponent } from './base/base.component';
import { AppShellComponent } from './app-shell/app-shell.component';
import { IsVideoPipe } from './pipes/is-video.pipe';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { VotesPipe } from './pipes/votes.pipe';
import { StrategyDetailsComponent } from './team-section/team-strategies/strategy-details/strategy-details.component';
import { HasVotedPipe } from './pipes/has-voted.pipe';
import { UserStrategiesComponent } from './player-section/user-strategies/user-strategies.component';
import { NewStrategyComponent } from './team-section/team-strategies/new-strategy/new-strategy.component';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { IsStratOwnerPipe } from './pipes/is-strat-owner.pipe';
import { ApiTournamentsService } from '../../src-common/services/bellumgens-api.tournaments.service';
import { StartsWithPipe } from './pipes/starts-with.pipe';
import { TeamNewComponent } from './team-section/team-new/team-new.component';
import { GetRegCountPipe } from './pipes/get-reg-count.pipe';
import { CommunicationService } from '../../src-common/services/communication.service';
import { SocialMediaService } from '../../src-common/services/social-media.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerDetailsComponent,
    HomeComponent,
    GroupsFilterPipe,
    WeekdayPipe,
    MapnamePipe,
    MapimagePipe,
    TeamDetailsComponent,
    LoginComponent,
    UnreadNotificationsPipe,
    PlayerNotificationsComponent,
    SortNotificationsPipe,
    DisabledNotificationsPipe,
    SuccessErrorComponent,
    TeamStrategiesComponent,
    TeamApplicationComponent,
    TeamOverviewComponent,
    TeamNotificationsComponent,
    SortApplicationsPipe,
    MapPoolComponent,
    SideStratsPipe,
    AvailabilityComponent,
    SafeVideoLinkPipe,
    TeamNavComponent,
    TeamSearchComponent,
    PlayerSearchComponent,
    SearchComponent,
    SteamCustomUrlPipe,
    PlayerCountryPipe,
    TopWeaponAltPipe,
    QuickSearchComponent,
    ReduceQuickSearchResultPipe,
    TeamResultsComponent,
    PlayerResultsComponent,
    ConfirmComponent,
    NotificationsComponent,
    DaysAvailablePipe,
    TeamPreferencesComponent,
    OpenPositionsPipe,
    SortWeaponsPipe,
    ExcludeMembersPipe,
    UserPreferencesComponent,
    NotificationStatePipe,
    EmailconfirmComponent,
    QueryParsedPipe,
    StrategyEditorComponent,
    ActiveDutyMapsPipe,
    UnauthorizedComponent,
    AddSteamComponent,
    BaseComponent,
    AppShellComponent,
    IsVideoPipe,
    TruncateTextPipe,
    VotesPipe,
    StrategyDetailsComponent,
    HasVotedPipe,
    UserStrategiesComponent,
    NewStrategyComponent,
    LoginDialogComponent,
    IsStratOwnerPipe,
    StartsWithPipe,
    TeamNewComponent,
    GetRegCountPipe
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
    CommunicationService,
    SocialMediaService,
    IgxIconService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconService: IgxIconService) {
    // this.iconService.addSvgIcon('Twitch', '/assets/login/Glitch_White_RGB.svg', 'login-icons');
    // this.iconService.addSvgIcon('TwitchFull', '/assets/login/Combo_White_RGB.svg', 'login-icons');
    this.iconService.addSvgIcon('Steam', '/assets/login/steam-logo-white.svg', 'login-icons');
    this.iconService.addSvgIcon('Facebook', '/assets/login/fb.svg', 'login-icons');
    this.iconService.addSvgIcon('Twitter', '/assets/login/twitter.svg', 'login-icons');
  }
}
