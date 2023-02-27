import { Component } from '@angular/core';
import { LoginProvider } from '../../../models/login-provider';
import { LoginService } from '../../../services/login.service';
import { LOGIN_ASSETS } from '../../../models/misc';
import { Observable } from 'rxjs';
import { IgxButtonModule, IgxIconModule, IgxDividerModule } from '@infragistics/igniteui-angular';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'bg-login-buttons',
    templateUrl: './login-buttons.component.html',
    styleUrls: ['./login-buttons.component.scss'],
    standalone: true,
    imports: [NgFor, IgxButtonModule, IgxIconModule, IgxDividerModule, AsyncPipe]
})
export class LoginButtonsComponent {
  public loginColors = LOGIN_ASSETS;
  public loginProviders: Observable<LoginProvider []>;

  constructor(private authManager: LoginService) {
    this.loginProviders = this.authManager.loginProviders;
  }

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }

}
