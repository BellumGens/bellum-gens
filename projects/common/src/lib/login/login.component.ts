import { Component, ViewChild } from '@angular/core';
import {
  IgxDropDownComponent,
  IgxButtonDirective,
  IgxRippleDirective,
  IgxIconComponent,
  IgxCircularProgressBarComponent,
  IgxToggleActionDirective,
  IgxAvatarComponent,
  IGX_TABS_DIRECTIVES
} from '@infragistics/igniteui-angular';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { GLOBAL_OVERLAY_SETTINGS } from '../../models/misc';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';



@Component({
  selector: 'bg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    LoginDialogComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxCircularProgressBarComponent,
    IgxToggleActionDirective,
    IgxAvatarComponent,
    IgxDropDownComponent,
    IGX_TABS_DIRECTIVES,
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
    this.authManager.logout().subscribe(() => this.close());
  }

  public close() {
    this.userProfile.close();
  }

  public navigateToProfile(user: ApplicationUser) {
    if (window.location.href.startsWith(environment.bellumgens)) {
      if (user.csgoDetails) {
        this.router.navigate(['/players/', user.csgoDetails.customUrl]);
      } else if (user.sc2Details) {
        this.router.navigate(['/players/', user.sc2Details.battleNetId]);
      }
    } else {
      if (user.csgoDetails) {
        window.location.href = `${environment.bellumgens}/players/${user.csgoDetails.customUrl}`;
      } else if (user.sc2Details) {
        window.location.href = `${environment.bellumgens}/players/${user.sc2Details.battleNetId}`;
      }
    }
  }
}


