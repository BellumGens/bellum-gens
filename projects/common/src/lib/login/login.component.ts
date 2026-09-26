import { Component, Signal, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IgxDropDownComponent } from '@infragistics/igniteui-angular/drop-down';
import { IgxButtonDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { GLOBAL_OVERLAY_SETTINGS } from '../../models/misc';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective } from '@infragistics/igniteui-angular/card';

@Component({
  selector: 'bg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    UserPreferencesComponent,
    IgxCardHeaderTitleDirective,
    IgxCardHeaderSubtitleDirective
  ]
})
export class LoginComponent {
  private authManager = inject(LoginService);
  private router = inject(Router);

  public dialog = viewChild.required(LoginDialogComponent);
  public userProfile = viewChild(IgxDropDownComponent);

  public authUser: Signal<ApplicationUser | null> = this.authManager.applicationUser;

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public userCheck: Signal<boolean> = this.authManager.userCheckInProgress;

  constructor() {
    this.authManager.openLogin.pipe(takeUntilDestroyed())
      .subscribe(() => this.dialog().openLogin());
  }

  public logout() {
    this.authManager.logout().subscribe(() => this.close());
  }

  public close() {
    this.userProfile()?.close();
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


