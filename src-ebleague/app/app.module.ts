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
  IgxDropDownModule,
  IgxCheckboxModule,
  IgxToggleModule,
  IgxTabsModule,
  IgxSnackbarModule,
  IgxBannerModule,
  IgxIconService,
  IgxSwitchModule,
  IgxSelectModule,
  IgxDividerModule,
  IgxAutocompleteModule,
  IgxChipsModule} from 'igniteui-angular';
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
import { LoginComponent } from '../../src-bellumgens/app/login/login.component';
import { GetRegCountPipe } from '../../src-bellumgens/app/pipes/get-reg-count.pipe';
import { StartsWithPipe } from '../../src-bellumgens/app/pipes/starts-with.pipe';
import { GroupsFilterPipe } from '../../src-bellumgens/app/pipes/groups-filter.pipe';
import { UserPreferencesComponent } from '../../src-bellumgens/app/player-section/user-preferences/user-preferences.component';
import { PlayerCountryPipe } from '../../src-bellumgens/app/pipes/player-country.pipe';
import { TournamentCsgoComponent } from './tournaments/tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournaments/tournament-sc2/tournament-sc2.component';
import { BaseComponent } from '../../src-bellumgens/app/base/base.component';
import { AdminComponent } from './admin/admin.component';
import { TournamentRegistrationComponent } from './tournaments/tournament-registration/tournament-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    SuccessErrorComponent,
    ConfirmComponent,
    TournamentHomeComponent,
    TeamNewComponent,
    TournamentFormatComponent,
    LoginComponent,
    LoginDialogComponent,
    UserPreferencesComponent,
    GetRegCountPipe,
    StartsWithPipe,
    GroupsFilterPipe,
    PlayerCountryPipe,
    TournamentCsgoComponent,
    TournamentSc2Component,
    AdminComponent,
    TournamentRegistrationComponent
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
    IgxTabsModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxBadgeModule,
    IgxCardModule,
    IgxDropDownModule,
    IgxCheckboxModule,
    IgxSnackbarModule,
    IgxBannerModule,
    IgxProgressBarModule,
    IgxSwitchModule,
    IgxSelectModule,
    IgxDividerModule,
    IgxAutocompleteModule,
    IgxChipsModule,
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
    this.iconService.addSvgIcon('Steam', '/assets/login/steam-logo-white.svg', 'login-icons');
    this.iconService.addSvgIcon('Facebook', '/assets/login/fb.svg', 'login-icons');
    this.iconService.addSvgIcon('Twitter', '/assets/login/twitter.svg', 'login-icons');
    this.iconService.addSvgIcon('BattleNet', '/assets/login/battle-net.svg', 'login-icons');
    this.iconService.addSvgIcon('Discord', '/assets/login/Discord-Logo-White.svg', 'login-icons');
    this.iconService.addSvgIcon('isobar', '/assets/partners/isobar.svg', 'partners');
  }
}
