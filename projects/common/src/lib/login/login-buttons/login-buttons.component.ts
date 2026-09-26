import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoginProvider } from '../../../models/login-provider';
import { LoginService } from '../../../services/login.service';
import { LOGIN_ASSETS } from '../../../models/misc';
import { IgxButtonDirective, IgxDividerComponent } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
  selector: 'bg-login-buttons',
  templateUrl: './login-buttons.component.html',
  styleUrls: ['./login-buttons.component.scss'],
  imports: [IgxButtonDirective, IgxIconComponent, IgxDividerComponent]
})
export class LoginButtonsComponent {
  private authManager = inject(LoginService);

  public loginColors = LOGIN_ASSETS;
  public loginProviders = toSignal(this.authManager.loginProviders, { initialValue: [] as LoginProvider [] });

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }
}
