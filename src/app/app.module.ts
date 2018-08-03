import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IgxNavigationDrawerModule,
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxListModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxFilterModule,
  IgxDatePickerModule,
  IgxDialogModule,
  IgxButtonModule,
  IgxProgressBarModule,
  IgxToggleModule } from 'igniteui-angular';
import { PlayersComponent } from './players/players.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { LoginService } from './services/login.service';
import { BellumgensApiService } from './services/bellumgens-api.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlayerDetailsComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IgxAvatarModule,
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxListModule,
    IgxIconModule,
    IgxDialogModule,
    IgxInputGroupModule,
    IgxFilterModule,
    IgxDatePickerModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxProgressBarModule
  ],
  providers: [
    LoginService,
    BellumgensApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
