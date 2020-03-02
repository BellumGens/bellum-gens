import { Component } from '@angular/core';
import { UserPreferences, ApplicationUser } from '../../models/applicationuser';
import { LoginService } from '../../services/login.service';
import { LoginProvider } from '../../models/login-provider';
import { LOGIN_ASSETS } from '../../models/misc';
import { TournamentApplication } from '../../models/tournament';
import { ApiTournamentsService } from '../../services/bellumgens-api.tournaments.service';

@Component({
  selector: 'bg-user-preferences',
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
  public submitInProgress = false;

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
    this.submitInProgress = true;
    this.authManager.updateUserPreferences(this.preferences).subscribe(_ => this.submitInProgress = false);
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
