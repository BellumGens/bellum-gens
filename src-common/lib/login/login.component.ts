import { Component, Input, NgModule, ViewChild } from '@angular/core';
import {
  IgxProgressType,
  IgxDropDownComponent,
  IgxDialogModule,
  IgxIconModule,
  IgxButtonModule,
  IgxRippleModule,
  IgxListModule,
  IgxDividerModule,
  IgxSwitchModule,
  IgxAvatarModule,
  IgxProgressBarModule,
  IgxToggleModule,
  IgxDropDownModule,
  IgxTabsModule,
  IgxInputGroupModule,
  IgxCheckboxModule
} from '@infragistics/igniteui-angular';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { GLOBAL_OVERLAY_SETTINGS } from '../../models/misc';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { LoginButtonsComponent } from './login-buttons/login-buttons.component';
import { ConfirmModule } from '../confirm/confirm.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProfileCompleteness {
  availability: boolean;
  primaryRole: boolean;
  secondaryRole: boolean;
  mapPool: boolean;
  profileStage: number;
  doneColor: string;
  pendingColor: string;
  doneIcon: string;
  pendingIcon: string;
  progressType: IgxProgressType;
}

@Component({
  selector: 'bg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild(LoginDialogComponent, { static: true })
  public dialog: LoginDialogComponent;

  @ViewChild(IgxDropDownComponent, { static: false })
  public userProfile: IgxDropDownComponent;

  @Input()
  public authUser: ApplicationUser;

  public profileCompleteness: ProfileCompleteness;
  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public userCheck = false;

  constructor(private authManager: LoginService,
              private router: Router) {
    this.authManager.userCheckInProgress.subscribe(value => this.userCheck = value);
    this.authManager.openLogin.subscribe(value => this.openLogin(value));
  }

  public openLogin(title?: string) {
    this.dialog.openLogin(title);
  }

  public logout() {
    this.authManager.logout().subscribe(() => this.userProfile.close());
  }

  public navigateToProfile(id: string) {
    if (window.location.href.startsWith(environment.bellumgens)) {
      this.router.navigate(['/players/', id]);
    } else {
      window.location.href = `${environment.bellumgens}/players/${id}`;
    }
  }
}

@NgModule({
  declarations: [
    LoginComponent,
    LoginDialogComponent,
    LoginButtonsComponent,
    UserPreferencesComponent
  ],
  exports: [
    LoginComponent,
    LoginDialogComponent,
    LoginButtonsComponent,
    UserPreferencesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IgxDialogModule,
    IgxIconModule,
    IgxButtonModule,
    IgxRippleModule,
    IgxListModule,
    IgxDividerModule,
    IgxCheckboxModule,
    IgxSwitchModule,
    IgxAvatarModule,
    IgxProgressBarModule,
    IgxToggleModule,
    IgxDropDownModule,
    IgxTabsModule,
    IgxInputGroupModule,
    ConfirmModule
  ]
})
export class LoginModule {}
