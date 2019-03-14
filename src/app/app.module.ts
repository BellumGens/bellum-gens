import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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
  IgxSelectModule} from 'igniteui-angular';
import { PlayersComponent } from './player-section/players/players.component';
import { PlayerDetailsComponent } from './player-section/player-details/player-details.component';
import { LoginService } from './services/login.service';
import { BellumgensApiService } from './services/bellumgens-api.service';
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
import { environment } from '../environments/environment';
import { ExcludeMembersPipe } from './pipes/exclude-members.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlayerDetailsComponent,
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
    ExcludeMembersPipe
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
    RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    LoginService,
    BellumgensApiService,
    IgxIconService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconService: IgxIconService) {
    this.iconService.addSvgIcon('ak47', '/assets/weapon-icons/svg_normal/weapon_ak47.svg', 'weapon-icons');
    this.iconService.addSvgIcon('awp', '/assets/weapon-icons/svg_normal/weapon_awp.svg', 'weapon-icons');
    this.iconService.addSvgIcon('aug', '/assets/weapon-icons/svg_normal/weapon_aug.svg', 'weapon-icons');
    this.iconService.addSvgIcon('bizon', '/assets/weapon-icons/svg_normal/weapon_bizon.svg', 'weapon-icons');
    this.iconService.addSvgIcon('deagle', '/assets/weapon-icons/svg_normal/weapon_deagle.svg', 'weapon-icons');
    this.iconService.addSvgIcon('famas', '/assets/weapon-icons/svg_normal/weapon_famas.svg', 'weapon-icons');
    this.iconService.addSvgIcon('fiveseven', '/assets/weapon-icons/svg_normal/weapon_fiveseven.svg', 'weapon-icons');
    this.iconService.addSvgIcon('g3sg1', '/assets/weapon-icons/svg_normal/weapon_g3sg1.svg', 'weapon-icons');
    this.iconService.addSvgIcon('galilar', '/assets/weapon-icons/svg_normal/weapon_galilar.svg', 'weapon-icons');
    this.iconService.addSvgIcon('glock', '/assets/weapon-icons/svg_normal/weapon_glock.svg', 'weapon-icons');
    this.iconService.addSvgIcon('m4a1', '/assets/weapon-icons/svg_normal/weapon_m4a1.svg', 'weapon-icons');
    this.iconService.addSvgIcon('m4a1_silencer', '/assets/weapon-icons/svg_normal/weapon_m4a1_silencer.svg', 'weapon-icons');
    this.iconService.addSvgIcon('hkp2000', '/assets/weapon-icons/svg_normal/weapon_usp_silencer.svg', 'weapon-icons');
    this.iconService.addSvgIcon('sg556', '/assets/weapon-icons/svg_normal/weapon_sg556.svg', 'weapon-icons');
    this.iconService.addSvgIcon('p90', '/assets/weapon-icons/svg_normal/weapon_p90.svg', 'weapon-icons');
    this.iconService.addSvgIcon('ump45', '/assets/weapon-icons/svg_normal/weapon_ump45.svg', 'weapon-icons');
    this.iconService.addSvgIcon('tec9', '/assets/weapon-icons/svg_normal/weapon_tec9.svg', 'weapon-icons');
    this.iconService.addSvgIcon('p250', '/assets/weapon-icons/svg_normal/weapon_p250.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mac10', '/assets/weapon-icons/svg_normal/weapon_mac10.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mp7', '/assets/weapon-icons/svg_normal/weapon_mp7.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mp9', '/assets/weapon-icons/svg_normal/weapon_mp9.svg', 'weapon-icons');
    this.iconService.addSvgIcon('ssg08', '/assets/weapon-icons/svg_normal/weapon_ssg08.svg', 'weapon-icons');
    this.iconService.addSvgIcon('xm1014', '/assets/weapon-icons/svg_normal/weapon_xm1014.svg', 'weapon-icons');
    this.iconService.addSvgIcon('hegrenade', '/assets/weapon-icons/svg_normal/weapon_hegrenade.svg', 'weapon-icons');
    this.iconService.addSvgIcon('scar20', '/assets/weapon-icons/svg_normal/weapon_scar20.svg', 'weapon-icons');
    this.iconService.addSvgIcon('negev', '/assets/weapon-icons/svg_normal/weapon_negev.svg', 'weapon-icons');
    this.iconService.addSvgIcon('knife', '/assets/weapon-icons/svg_normal/weapon_knife.svg', 'weapon-icons');
    this.iconService.addSvgIcon('molotov', '/assets/weapon-icons/svg_normal/weapon_molotov.svg', 'weapon-icons');
    this.iconService.addSvgIcon('nova', '/assets/weapon-icons/svg_normal/weapon_nova.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mag7', '/assets/weapon-icons/svg_normal/weapon_mag7.svg', 'weapon-icons');
    this.iconService.addSvgIcon('m249', '/assets/weapon-icons/svg_normal/weapon_m249.svg', 'weapon-icons');
    this.iconService.addSvgIcon('elite', '/assets/weapon-icons/svg_normal/weapon_elite.svg', 'weapon-icons');
    this.iconService.addSvgIcon('sawedoff', '/assets/weapon-icons/svg_normal/weapon_sawedoff.svg', 'weapon-icons');
    this.iconService.addSvgIcon('taser', '/assets/weapon-icons/svg_normal/weapon_taser.svg', 'weapon-icons');
    this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
    this.iconService.addSvgIcon('discord', '/assets/discord.svg', 'weapon-icons');
  }
}
