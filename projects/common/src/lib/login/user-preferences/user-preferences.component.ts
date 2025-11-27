import { Component, EventEmitter, Output, inject } from '@angular/core';
import { UserPreferences, ApplicationUser } from '../../../models/applicationuser';
import { LoginService } from '../../../services/login.service';
import { LoginProvider } from '../../../models/login-provider';
import { LOGIN_ASSETS } from '../../../models/misc';
import { TournamentApplication, TournamentApplicationState } from '../../../models/tournament';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import {
  IgxButtonDirective,
  IgxRippleDirective,
  IgxIconComponent,
  IgxDividerDirective,
  IgxSwitchComponent,
  IGX_LIST_DIRECTIVES
} from '@infragistics/igniteui-angular';
import { NgClass } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'bg-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss'],
  imports: [
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxDividerDirective,
    IgxSwitchComponent,
    FormsModule,
    IGX_LIST_DIRECTIVES,
    NgClass,
    ConfirmComponent
  ]
})
export class UserPreferencesComponent {
  private authManager = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private router = inject(Router);

  public preferences: UserPreferences = {
    searchVisible: true,
    email: ''
  };

  public loginColors = LOGIN_ASSETS;
  public providers: LoginProvider[];
  public authUser: ApplicationUser;
  public registrations: TournamentApplication [];
  public isTournamentAdmin = false;
  public regStates = [$localize`Pending`, $localize`Confirmed`, $localize`Banned`];

  @Output()
  public userDeleted = new EventEmitter<void>();

  constructor() {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.preferences = {
          searchVisible: user.searchVisible,
          email: user.email
        };
        this.authManager.tournamentRegistrations.subscribe(data => this.registrations = data);
        this.authUser = user;
        this.authManager.getUserIsTournamentAdmin().subscribe(data => this.isTournamentAdmin = data);
      }
    });
    this.authManager.loginProviders.subscribe(providers => this.providers = providers);
  }

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }

  public submitPreferences() {
    this.authManager.updateUserPreferences(this.preferences).subscribe({
      error: () => {}
    });
  }

  public deleteAccount() {
    this.authManager.deleteAccount(this.authUser.id).subscribe({
      next: () => {
        this.userDeleted.emit();
      },
      error: () => {}
    });
  }

  public weeklyCheckin(registration: TournamentApplication) {
    if (registration.state !== TournamentApplicationState.Banned) {
      this.apiService.weeklyCheckin(registration).subscribe({
        next: () => registration.state = 1,
        error: () => {}
      });
    }
  }

  public deleteRegistration(registration: TournamentApplication) {
    this.apiService.deleteRegistration(registration.id).subscribe({
      next: () => {
        this.registrations.splice(this.registrations.indexOf(registration), 1);
      },
      error: () => {}
    });
  }

  public disableLogin(provider: string) {
    return this.authUser ? this.authUser.externalLogins.includes(provider) : false;
  }

  public openRegistration() {
    this.router.navigate(['register']);
  }

  public navigateToEventAdmin() {
    if (window.location.href.startsWith(environment.ebleague)) {
      this.router.navigate(['/admin/sc2']);
    } else {
      window.location.href = `${environment.ebleague}/admin/sc2`;
    }
  }
}
