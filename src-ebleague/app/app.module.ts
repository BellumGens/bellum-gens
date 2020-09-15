import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginService } from '../../src-common/services/login.service';
import { BellumgensApiService } from '../../src-common/services/bellumgens-api.service';
import { environment } from '../../src-common/environments/environment';
import { TournamentHomeComponent } from './home/home.component';
import { ApiTournamentsService } from '../../src-common/services/bellumgens-api.tournaments.service';
import { GetRegCountPipe } from '../../src-bellumgens/app/pipes/get-reg-count.pipe';
import { BellumGensModule } from '../../src-common/components/components.module';
import { RaffleComponent } from './raffle/raffle.component';
import { TournamentRegistrationComponent } from './tournament-registration/tournament-registration.component';
import { StartsWithPipe } from '../../src-bellumgens/app/pipes/starts-with.pipe';
import { TeamNewComponent } from '../../src-bellumgens/app/team-section/team-new/team-new.component';
import { GroupsFilterPipe } from '../../src-bellumgens/app/pipes/groups-filter.pipe';
import { RegistrationSuccessComponent } from './tournament-registration/registration-success/registration-success.component';

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
import { socialMedia, logos } from '@igniteui/material-icons-extended';
import { NewsComponent } from './news/news.component';

@NgModule({
  declarations: [
    AppComponent,
    TournamentHomeComponent,
    GetRegCountPipe,
    RaffleComponent,
    TournamentRegistrationComponent,
    TeamNewComponent,
    StartsWithPipe,
    GroupsFilterPipe,
    RegistrationSuccessComponent,
    NewsComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
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
    BellumGensModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule
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
    const smproviders = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
    const complogos = ['discord', 'steam'];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c, logos.find(s => s.name === c).value, 'login-icons'));
    smproviders.forEach(p => this.iconService.addSvgIconFromText(p, socialMedia.find(s => s.name === p).value, 'login-icons'));
    this.iconService.addSvgIcon('BattleNet', '/assets/login/battle-net.svg', 'login-icons');
    this.iconService.addSvgIcon('isobar', '/assets/partners/isobar.svg', 'partners');
    this.iconService.addSvgIcon('vmware', '/assets/partners/vmware.svg', 'partners');
    this.iconService.addSvgIcon('telus', '/assets/partners/telus.svg', 'partners');
    this.iconService.addSvgIcon('modis', '/assets/partners/modis.svg', 'partners');
    this.iconService.addSvgIcon('omen', '/assets/partners/omen.svg', 'partners');
  }
}
