import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoginProvider, LOGIN_ASSETS } from 'bellum-gens-common/models';
import { LoginService } from 'bellum-gens-common/services';
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

  public loginColors: Readonly<Record<string, string>> = LOGIN_ASSETS;
  public loginProviders = toSignal(this.authManager.loginProviders, { initialValue: [] as LoginProvider [] });

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }
}
