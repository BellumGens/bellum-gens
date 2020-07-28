import { Component } from '@angular/core';
import { LoginProvider } from '../../../models/login-provider';
import { LoginService } from '../../../services/login.service';
import { LOGIN_ASSETS } from '../../../models/misc';

@Component({
  selector: 'bg-login-buttons',
  templateUrl: './login-buttons.component.html',
  styleUrls: ['./login-buttons.component.scss']
})
export class LoginButtonsComponent {
  public loginColors = LOGIN_ASSETS;
  public loginProviders: LoginProvider [];

  constructor(private authManager: LoginService) {
    this.authManager.loginProviders.subscribe(providers => this.loginProviders = providers);
  }

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }

}
