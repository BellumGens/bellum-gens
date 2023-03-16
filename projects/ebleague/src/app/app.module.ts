import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../../../common/src/environments/environment';
import { HomeComponent } from './home/home.component';
import { RaffleComponent } from './raffle/raffle.component';
import { TournamentRegistrationComponent } from './tournament-registration/tournament-registration.component';
import { StartsWithPipe } from '../../../bellumgens/src/app/pipes/starts-with.pipe';
import { TeamNewComponent } from '../../../bellumgens/src/app/team-section/team-new/team-new.component';
import { GroupsFilterPipe } from '../../../bellumgens/src/app/pipes/groups-filter.pipe';
import { RegistrationSuccessComponent } from './tournament-registration/registration-success/registration-success.component';
import { NewsComponent } from './news/news.component';
import { GetRegCountPipe } from './pipes/get-reg-count.pipe';

import {
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxProgressBarModule,
  IgxBannerModule,
  IgxIconService,
  IgxDividerModule,
  IgxAvatarModule,
  IgxNavigationDrawerModule,
  IgxSelectModule,
  IgxDropDownModule,
  IgxCheckboxModule,
  IgxAutocompleteModule,
  IgxDialogModule,
  IgxListModule,
  IgxCardModule
} from '@infragistics/igniteui-angular';
import { socialMedia, logos, heartCare } from '@igniteui/material-icons-extended';
import { LanguagesComponent, LoginComponent, SuccessErrorComponent } from '../../../common/src/public_api';

@NgModule({
    declarations: [AppComponent],
    imports: [
        FormsModule,
        HttpClientModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        AppRoutingModule,
        TransferHttpCacheModule,
        IgxNavbarModule,
        IgxLayoutModule,
        IgxRippleModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxButtonModule,
        IgxBannerModule,
        IgxProgressBarModule,
        IgxDividerModule,
        IgxAvatarModule,
        IgxNavigationDrawerModule,
        IgxSelectModule,
        IgxDropDownModule,
        IgxCheckboxModule,
        IgxAutocompleteModule,
        IgxDialogModule,
        IgxListModule,
        IgxCardModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        HammerModule,
        HomeComponent,
        GetRegCountPipe,
        RaffleComponent,
        TournamentRegistrationComponent,
        TeamNewComponent,
        StartsWithPipe,
        GroupsFilterPipe,
        RegistrationSuccessComponent,
        NewsComponent,
        SuccessErrorComponent,
        LoginComponent,
        LanguagesComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconService: IgxIconService) {
    const smproviders = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
    const complogos = ['discord', 'steam', 'twitch', 'battlenet'];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c, logos.find(s => s.name === c).value, 'login-icons'));
    smproviders.forEach(p => this.iconService.addSvgIconFromText(p, socialMedia.find(s => s.name === p).value, 'login-icons'));
    this.iconService.addSvgIconFromText(heartCare.name, heartCare.value, 'health-icons');

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
