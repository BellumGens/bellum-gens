import { Component } from '@angular/core';
import { UserPreferences, ApplicationUser } from '../../models/applicationuser';
import { LoginService } from '../../services/login.service';
import { LoginProvider } from '../../models/login-provider';
import { BaseComponent } from '../../base/base.component';
import { LOGIN_ASSETS } from 'src/app/models/misc';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent extends BaseComponent {
  public preferences: UserPreferences = {
    email: '',
    searchVisible: true
  };

  public loginColors = LOGIN_ASSETS;

  public providers: LoginProvider[];

  public authUser: ApplicationUser;

  constructor(private authManager: LoginService) {
    super();
    this.subs.push(this.authManager.applicationUser.subscribe(user => {
      this.preferences = {
        email: user.email,
        searchVisible: user.searchVisible
      };
      this.authUser = user;
    }));
    this.subs.push(this.authManager.loginProviders.subscribe(providers => this.providers = providers));
  }

  public login(provider: string) {
    this.authManager.login(provider);
  }

  public submitPreferences() {
    this.authManager.updateUserPreferences(this.preferences).subscribe();
  }

  public deleteAccount() {
    this.authManager.deleteAccount(this.authUser.id).subscribe();
  }

  public disableLogin(provider: string) {
    return this.authUser ? this.authUser.externalLogins.includes(provider) : false;
  }
}
