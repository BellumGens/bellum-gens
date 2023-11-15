import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TransferHttpCacheModule } from '@angular/ssr';
import { NgOptimizedImage } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../../../common/src/environments/environment';

import {
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxIconModule,
  IgxButtonModule,
  IgxBannerModule,
  IgxIconService,
  IgxDividerModule,
  IgxNavigationDrawerModule,
  changei18n
} from '@infragistics/igniteui-angular';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';
import { heartCare, discord, steam, twitch, battlenet, facebook, twitter, instagram, linkedin, youtube } from '@igniteui/material-icons-extended';
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
      NgOptimizedImage,
      IgxNavbarModule,
      IgxLayoutModule,
      IgxRippleModule,
      IgxIconModule,
      IgxButtonModule,
      IgxBannerModule,
      IgxDividerModule,
      IgxNavigationDrawerModule,
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      HammerModule,
      SuccessErrorComponent,
      LoginComponent,
      LanguagesComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(LOCALE_ID) private localeId: string, private iconService: IgxIconService) {
    const complogos = [discord, steam, twitch, battlenet, facebook, twitter, instagram, linkedin, youtube];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c.name, c.value, 'login-icons'));
    this.iconService.addSvgIconFromText(heartCare.name, heartCare.value, 'health-icons');

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
