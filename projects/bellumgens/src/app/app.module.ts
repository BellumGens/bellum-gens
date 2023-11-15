import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TransferHttpCacheModule } from '@angular/ssr';

import {
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxBadgeModule,
  IgxDropDownModule,
  IgxBannerModule,
  IgxIconService,
  IgxDividerModule,
  IgxNavigationDrawerModule,
  changei18n
} from '@infragistics/igniteui-angular';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';
import { facebook, twitter, instagram, linkedin, discord, steam, twitch, battlenet, heartCare } from '@igniteui/material-icons-extended';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search/search.component';
import { QuickSearchComponent } from './search/quick-search/quick-search.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../../common/src/environments/environment';
import { LanguagesComponent, LoginComponent, SuccessErrorComponent } from '../../../common/src/public_api';


@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    IgxAvatarModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxIconModule,
    IgxInputGroupModule,
    IgxButtonModule,
    IgxBadgeModule,
    IgxDropDownModule,
    IgxBannerModule,
    IgxDividerModule,
    IgxNavigationDrawerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule,
    SearchComponent,
    QuickSearchComponent,
    SuccessErrorComponent,
    LoginComponent,
    LanguagesComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(LOCALE_ID) private localeId: string, private iconService: IgxIconService) {
    const complogos = [discord, steam, twitch, battlenet, facebook, twitter, instagram, linkedin];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c.name, c.value, 'login-icons'));
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

    if (this.localeId === 'bg') {
      changei18n(IgxResourceStringsBG);
    }
  }
}
