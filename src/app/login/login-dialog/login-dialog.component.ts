import { Component, ViewChild } from '@angular/core';
import { LoginProvider } from '../../models/login-provider';
import { LOGIN_ASSETS } from '../../models/misc';
import { IgxDialogComponent } from 'igniteui-angular';
import { BaseComponent } from '../../base/base.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent extends BaseComponent {
  public loginProviders: LoginProvider [];
  public loginColors = LOGIN_ASSETS;

  public title = 'Choose login provider';

  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  constructor(private authManager: LoginService) {
    super();
    this.subs.push(
      this.authManager.loginProviders.subscribe(providers => this.loginProviders = providers)
    );
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
