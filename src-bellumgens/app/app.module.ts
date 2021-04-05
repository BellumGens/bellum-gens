import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TransferHttpCacheModule } from '@nguniversal/common';

import {
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxListModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxProgressBarModule,
  IgxBadgeModule,
  IgxCardModule,
  IgxChipsModule,
  IgxDropDownModule,
  IgxToggleModule,
  IgxExpansionPanelModule,
  IgxRadioModule,
  IgxBannerModule,
  IgxButtonGroupModule,
  IgxIconService,
  IgxSliderModule,
  IgxSelectModule,
  IgxDividerModule,
  IgxCarouselModule,
  IgxNavigationDrawerModule
} from '@infragistics/igniteui-angular';
import { socialMedia, logos, heartCare } from '@igniteui/material-icons-extended';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { PlayerSearchComponent } from './search/player-search/player-search.component';
import { SearchComponent } from './search/search/search.component';
import { QuickSearchComponent } from './search/quick-search/quick-search.component';
import { ReduceQuickSearchResultPipe } from './pipes/reduce-quick-search-result.pipe';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../src-common/environments/environment';
import { EmailconfirmComponent } from './emailconfirm/emailconfirm.component';
import { QueryParsedPipe } from './pipes/query-parsed.pipe';
import { StartsWithPipe } from './pipes/starts-with.pipe';
import { TeamSearchComponent } from './search/team-search/team-search.component';
import { BellumGensModule, LanguagesModule, LoadingModule, LoginModule, SuccessErrorModule } from '../../src-common/lib/public_api';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnreadNotificationsPipe,
    PlayerSearchComponent,
    SearchComponent,
    QuickSearchComponent,
    ReduceQuickSearchResultPipe,
    TeamResultsComponent,
    PlayerResultsComponent,
    EmailconfirmComponent,
    QueryParsedPipe,
    StartsWithPipe,
    TeamSearchComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    IgxAvatarModule,
    IgxNavbarModule,
    IgxLayoutModule, // TODO: Remove
    IgxRippleModule,
    IgxListModule,
    IgxIconModule,
    IgxInputGroupModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxBadgeModule,
    IgxCardModule,
    IgxChipsModule,
    IgxDropDownModule,
    IgxExpansionPanelModule,
    IgxRadioModule,
    IgxBannerModule,
    IgxButtonGroupModule,
    IgxSliderModule,
    IgxProgressBarModule,
    IgxSelectModule,
    IgxDividerModule,
    IgxCarouselModule,
    IgxNavigationDrawerModule,
    LoginModule,
    SuccessErrorModule,
    LanguagesModule,
    LoadingModule,
    BellumGensModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconService: IgxIconService) {
    const smproviders = ['facebook', 'twitter', 'instagram', 'linkedin'];
    const complogos = ['discord', 'steam', 'twitch', 'battlenet'];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c, logos.find(s => s.name === c).value, 'login-icons'));
    smproviders.forEach(p => this.iconService.addSvgIconFromText(p, socialMedia.find(s => s.name === p).value, 'login-icons'));
    this.iconService.addSvgIconFromText(heartCare.name, heartCare.value, 'health-icons');

    this.iconService.addSvgIcon('bge-white', '/assets/login/bge-white.svg', 'partners');
    this.iconService.addSvgIcon('eb-league-white', '/assets/login/eb-league-white.svg', 'partners');
    //this.iconService.addSvgIcon('isobar', '/assets/partners/isobar.svg', 'partners');
    //this.iconService.addSvgIcon('vmware', '/assets/partners/vmware.svg', 'partners');
    //this.iconService.addSvgIcon('telus', '/assets/partners/telus.svg', 'partners');
    //this.iconService.addSvgIcon('modis', '/assets/partners/modis.svg', 'partners');
    //this.iconService.addSvgIcon('omen', '/assets/partners/omen.svg', 'partners');
    //this.iconService.addSvgIcon('paysafe', '/assets/partners/paysafe.svg', 'partners');

    this.iconService.addSvgIcon('en', '/assets/country-flags/svg/united-kingdom.svg', 'languages');
    this.iconService.addSvgIcon('bg', '/assets/country-flags/svg/bulgaria.svg', 'languages');
  }
}
