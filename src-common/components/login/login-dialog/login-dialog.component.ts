import { Component, ViewChild } from '@angular/core';
import { LoginProvider } from '../../../models/login-provider';
import { LOGIN_ASSETS } from '../../../models/misc';
import { IgxDialogComponent } from '@infragistics/igniteui-angular';
import { LoginService } from '../../../services/login.service';
import { UserLogin } from '../../../models/userlogin';
import { Router } from '@angular/router';

@Component({
  selector: 'bg-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  public loginProviders: LoginProvider [];
  public loginColors = LOGIN_ASSETS;
  public logininfo: UserLogin = {
    username: '',
    password: '',
    rememberMe: false
  };
  public submitInProgress = false;

  public title = 'Choose login provider';

  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  constructor(private authManager: LoginService, private router: Router) {
    this.authManager.loginProviders.subscribe(providers => this.loginProviders = providers);
  }

  public openLogin(title?: string) {
    if (title) {
      this.title = title;
    }
    this.dialog.open();
  }

  public openRegistration() {
    this.router.navigate(['register']);
    this.dialog.close();
  }

  public login(provider: string) {
    this.authManager.login(provider);
  }

  public loginWithForm() {
    this.authManager.loginWithForm(this.logininfo).subscribe(_ => this.dialog.close());
  }
}
