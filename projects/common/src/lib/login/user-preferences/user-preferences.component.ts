import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { UserPreferences, ApplicationUser } from '../../../models/applicationuser';
import { LoginService } from '../../../services/login.service';
import { LoginProvider } from '../../../models/login-provider';
import { LOGIN_ASSETS } from '../../../models/misc';
import { TournamentApplication, TournamentApplicationState } from '../../../models/tournament';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { IgxButtonDirective, IgxDividerComponent, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxSwitchComponent } from '@infragistics/igniteui-angular/switch';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
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
    IgxDividerComponent,
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

  public preferences = signal<UserPreferences>({
    searchVisible: true,
    email: ''
  });

  public loginColors = LOGIN_ASSETS;
  public providers = signal<LoginProvider []>([]);
  public authUser = signal<ApplicationUser | null>(null);
  public registrations = signal<TournamentApplication []>([]);
  public isTournamentAdmin = signal(false);
  public regStates = [$localize`Pending`, $localize`Confirmed`, $localize`Banned`];

  @Output()
  public userDeleted = new EventEmitter<void>();

  constructor() {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.preferences.set({
          searchVisible: user.searchVisible,
          email: user.email
        });
        this.authManager.tournamentRegistrations.subscribe(data => {
          if (data) {
            this.registrations.set(data);
          }
        });
        this.authUser.set(user);
        this.authManager.getUserIsTournamentAdmin().subscribe(data => this.isTournamentAdmin.set(data));
      }
    });
    this.authManager.loginProviders.subscribe(providers => this.providers.set(providers));
  }

  public login(provider: LoginProvider) {
    this.authManager.login(provider);
  }

  public setSearchVisible(searchVisible: boolean) {
    this.preferences.update(preferences => ({ ...preferences, searchVisible }));
    this.submitPreferences();
  }

  public submitPreferences() {
    this.authManager.updateUserPreferences(this.preferences()).subscribe({
      error: () => {}
    });
  }

  public deleteAccount() {
    this.authManager.deleteAccount(this.authUser().id).subscribe({
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
        const registrations = this.registrations();
        registrations.splice(registrations.indexOf(registration), 1);
        this.registrations.set([...registrations]);
      },
      error: () => {}
    });
  }

  public disableLogin(provider: string) {
    return this.authUser() ? this.authUser().externalLogins.includes(provider) : false;
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
