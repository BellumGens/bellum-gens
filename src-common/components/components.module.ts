import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IgxDialogModule,
  IgxButtonModule,
  IgxProgressBarModule,
  IgxAvatarModule,
  IgxTabsModule,
  IgxIconModule,
  IgxDropDownModule,
  IgxToggleModule,
  IgxDividerModule,
  IgxSwitchModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxSnackbarModule,
  IgxCheckboxModule
} from '@infragistics/igniteui-angular';

import { SuccessErrorComponent } from './success-error/success-error.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { LoginButtonsComponent } from './login/login-buttons/login-buttons.component';
import { RegistrationComponent } from './registration/registration.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { CSGOMapimagePipe } from './pipes/csgomapimage.pipe';
import { CSGOMapnamePipe } from './pipes/csgomapname.pipe';
import { Sc2MapNamePipe } from './pipes/sc2-map-name.pipe';


@NgModule({
  declarations: [
    ConfirmComponent,
    LoginDialogComponent,
    LoginButtonsComponent,
    LoginComponent,
    UserPreferencesComponent,
    SuccessErrorComponent,
    RegistrationComponent,
    UnauthorizedComponent,
    CSGOMapimagePipe,
    CSGOMapnamePipe,
    Sc2MapNamePipe
  ],
  exports: [
    ConfirmComponent,
    LoginDialogComponent,
    LoginButtonsComponent,
    LoginComponent,
    UserPreferencesComponent,
    SuccessErrorComponent,
    RegistrationComponent,
    UnauthorizedComponent,
    CSGOMapimagePipe,
    CSGOMapnamePipe,
    Sc2MapNamePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    IgxDialogModule,
    IgxButtonModule,
    IgxProgressBarModule,
    IgxAvatarModule,
    IgxTabsModule,
    IgxIconModule,
    IgxToggleModule,
    IgxDropDownModule,
    IgxDividerModule,
    IgxSwitchModule,
    IgxListModule,
    IgxInputGroupModule,
    IgxSnackbarModule,
    IgxCheckboxModule
  ]
})
export class BellumGensModule {}
