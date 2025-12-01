import { Component, inject } from '@angular/core';
import { LoginProvider } from '../../../models/login-provider';
import { LoginService } from '../../../services/login.service';
import { LOGIN_ASSETS } from '../../../models/misc';
import { Observable } from 'rxjs';
import { IgxButtonDirective, IgxDividerDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bg-login-buttons',
  templateUrl: './login-buttons.component.html',
  styleUrls: ['./login-buttons.component.scss'],
  imports: [IgxButtonDirective, IgxIconComponent, IgxDividerDirective, AsyncPipe]
})
export class LoginButtonsComponent {
  private authManager = inject(LoginService);

  public loginColors = LOGIN_ASSETS;
  public loginProviders: Observable<LoginProvider []>;

  constructor() {
    this.loginProviders = this.authManager.loginProviders;
  }

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }
}
