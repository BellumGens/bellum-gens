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
  IgxIconModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxBadgeModule,
  IgxDropDownModule,
  IgxBannerModule,
  IgxIconService,
  IgxDividerModule,
  IgxNavigationDrawerModule
} from '@infragistics/igniteui-angular';
import { socialMedia, logos, heartCare } from '@igniteui/material-icons-extended';

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
