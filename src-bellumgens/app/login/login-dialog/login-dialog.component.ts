import { Component, ViewChild } from '@angular/core';
import { LoginProvider } from '../../../../src-common/models/login-provider';
import { LOGIN_ASSETS } from '../../../../src-common/models/misc';
import { IgxDialogComponent } from 'igniteui-angular';
import { LoginService } from '../../../../src-common/services/login.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {
  public loginProviders: LoginProvider [];
  public loginColors = LOGIN_ASSETS;

  public title = 'Choose login provider';

  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  constructor(private authManager: LoginService) {
    this.authManager.loginProviders.subscribe(providers => this.loginProviders = providers);
  }

  public openLogin(title?: string) {
    if (title) {
      this.title = title;
    }
    this.dialog.open();
  }

  public login(provider: string) {
    this.authManager.login(provider);
  }

}
