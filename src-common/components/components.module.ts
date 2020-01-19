import { ConfirmComponent } from './confirm/confirm.component';
import { NgModule } from '@angular/core';
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
  IgxInputGroupModule} from 'igniteui-angular';
import { LoginComponent } from './login/login.component';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { CommonModule } from '@angular/common';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConfirmComponent,
    LoginDialogComponent,
    LoginComponent,
    UserPreferencesComponent
  ],
  exports: [
    ConfirmComponent,
    LoginDialogComponent,
    LoginComponent,
    UserPreferencesComponent
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
    IgxInputGroupModule
  ]
})
export class BellumGensModule {}
