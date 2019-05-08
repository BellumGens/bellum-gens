import { Component, Input } from '@angular/core';
import { UserPreferences, ApplicationUser } from '../../models/applicationuser';
import { LoginService } from '../../services/login.service';
import { LoginProvider } from 'src/app/models/login-provider';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent {
  public preferences: UserPreferences = {
    email: '',
    searchVisible: true
  };

  public providers: LoginProvider[];

  @Input()
  public set authUser(user: ApplicationUser) {
    if (!this._authUser || user.SteamUser.steamID64 !== this._authUser.SteamUser.steamID64) {
      this.preferences = {
        email: user.Email,
        searchVisible: user.SearchVisible
      };
      this._authUser = user;
    }
  }

  public get authUser() {
    return this._authUser;
  }

  private _authUser: ApplicationUser;

  constructor(private authManager: LoginService) {
    this.authManager.loginProviders.subscribe(providers => this.providers = providers.filter(p => p.Name !== 'Steam'));
  }

  public addLogin(provider: string) {
    this.authManager.login(provider);
  }

  public submitPreferences() {
    this.authManager.updateUserPreferences(this.preferences).subscribe();
  }

  public deleteAccount() {
    this.authManager.deleteAccount(this._authUser.SteamUser.steamID64).subscribe();
  }
}
