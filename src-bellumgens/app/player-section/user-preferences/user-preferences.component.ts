import { Component } from '@angular/core';
import { UserPreferences, ApplicationUser } from '../../../../src-common/models/applicationuser';
import { LoginService } from '../../../../src-common/services/login.service';
import { LoginProvider } from '../../../../src-common/models/login-provider';
import { LOGIN_ASSETS } from '../../../../src-common/models/misc';
import { TournamentApplication } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';

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

  public loginColors = LOGIN_ASSETS;
  public providers: LoginProvider[];
  public authUser: ApplicationUser;
  public registrations: TournamentApplication [];

  constructor(private authManager: LoginService, private apiService: ApiTournamentsService) {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.preferences = {
          email: user.email,
          searchVisible: user.searchVisible
        };
        this.apiService.registrations.subscribe(data => this.registrations = data);
      }
      this.authUser = user;
    });
    this.authManager.loginProviders.subscribe(providers => this.providers = providers);
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

  public deleteRegistration(registration: TournamentApplication) {
    this.apiService.deleteRegistration(registration.Id).subscribe(id => {
      this.registrations.splice(this.registrations.indexOf(registration), 1);
    });
  }


  public disableLogin(provider: string) {
    return this.authUser ? this.authUser.externalLogins.includes(provider) : false;
  }
}
