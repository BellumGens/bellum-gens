import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IgxDialogModule,
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
  IgxSnackbarModule} from 'igniteui-angular';

import { SuccessErrorComponent } from './success-error/success-error.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';


@NgModule({
  declarations: [
    ConfirmComponent,
    LoginDialogComponent,
    LoginComponent,
    UserPreferencesComponent,
    SuccessErrorComponent
  ],
  exports: [
    ConfirmComponent,
    LoginDialogComponent,
    LoginComponent,
    UserPreferencesComponent,
    SuccessErrorComponent
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
    IgxSnackbarModule
  ]
})
export class BellumGensModule {}
