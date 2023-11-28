import { Component, ViewChild } from '@angular/core';
import {
  IgxDropDownComponent,
  IgxIconModule,
  IgxButtonModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxProgressBarModule,
  IgxToggleModule,
  IgxDropDownModule,
  IgxTabsModule
} from '@infragistics/igniteui-angular';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { GLOBAL_OVERLAY_SETTINGS } from '../../models/misc';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';

import { NgIf } from '@angular/common';

@Component({
    selector: 'bg-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      LoginDialogComponent,
      NgIf,
      IgxButtonModule,
      IgxRippleModule,
      IgxIconModule,
      IgxProgressBarModule,
      IgxToggleModule,
      IgxAvatarModule,
      IgxDropDownModule,
      IgxTabsModule,
      UserPreferencesComponent
    ]
})
export class LoginComponent {
  @ViewChild(LoginDialogComponent, { static: true })
  public dialog: LoginDialogComponent;

  @ViewChild(IgxDropDownComponent, { static: false })
  public userProfile: IgxDropDownComponent;

  public authUser: ApplicationUser;

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public userCheck = false;

  constructor(private authManager: LoginService,
              private router: Router) {
    this.authManager.userCheckInProgress.subscribe(value => this.userCheck = value);
    this.authManager.applicationUser.subscribe(user => this.authUser = user);
    this.authManager.openLogin.subscribe(() => this.dialog.openLogin());
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


