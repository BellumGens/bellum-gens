import { Component, Signal, computed, effect, inject, linkedSignal, output, signal, untracked } from '@angular/core';
import {
  UserPreferences,
  ApplicationUser,
  LoginProvider,
  LOGIN_ASSETS,
  TournamentApplication,
  TournamentApplicationState
} from 'bellum-gens-common/models';
import { LoginService, ApiTournamentsService, PAGE_LOCATION } from 'bellum-gens-common/services';
import { environment } from 'bellum-gens-common/environments';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { IgxButtonDirective, IgxDividerComponent, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxSwitchComponent } from '@infragistics/igniteui-angular/switch';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';

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
    ConfirmComponent,
    IgxIconButtonDirective
  ]
})
export class UserPreferencesComponent {
  private authManager = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private router = inject(Router);
  private location = inject(PAGE_LOCATION);

  public authUser: Signal<ApplicationUser | null> = this.authManager.applicationUser;

  // Locally editable copy of the user preferences. Re-seeds whenever a user logs in.
  public preferences = linkedSignal<ApplicationUser | null, UserPreferences>({
    source: this.authUser,
    computation: (user, previous) => user
      ? { searchVisible: user.searchVisible, email: user.email ?? '' }
      : previous?.value ?? { searchVisible: true, email: '' }
  });

  public loginColors: Readonly<Record<string, string>> = LOGIN_ASSETS;
  public providers = signal<LoginProvider []>([]);
  // The registrations are cached by the login service and only pulled once a user is logged in.
  public registrations = computed<TournamentApplication []>(() =>
    this.authUser() ? this.authManager.tournamentRegistrations() ?? [] : []
  );
  public isTournamentAdmin = signal(false);
  public isAdmin = signal(false);
  public regStates = [$localize`Pending`, $localize`Confirmed`, $localize`Banned`];

  public userDeleted = output<void>();

  constructor() {
    effect(() => {
      if (this.authUser()) {
        untracked(() => {
          this.authManager.getUserIsTournamentAdmin().subscribe(data => this.isTournamentAdmin.set(data));
          this.authManager.getUserIsAppAdmin().subscribe(data => this.isAdmin.set(data));
        });
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
    const user = this.authUser();
    if (!user) {
      return;
    }
    this.authManager.deleteAccount(user.id).subscribe({
      next: () => {
        this.userDeleted.emit();
      },
      error: () => {}
    });
  }

  public weeklyCheckin(registration: TournamentApplication) {
    if (registration.state !== TournamentApplicationState.Banned) {
      this.apiService.weeklyCheckin(registration).subscribe({
        next: () => this.updateRegistrations(this.registrations()
          .map(r => r.id === registration.id ? { ...r, state: TournamentApplicationState.Confirmed } : r)),
        error: () => {}
      });
    }
  }

  public deleteRegistration(registration: TournamentApplication) {
    if (!registration.id) {
      return;
    }
    this.apiService.deleteRegistration(registration.id).subscribe({
      next: () => this.updateRegistrations(this.registrations().filter(r => r.id !== registration.id)),
      error: () => {}
    });
  }

  public disableLogin(provider: string) {
    return this.authUser()?.externalLogins.includes(provider) ?? false;
  }

  public openRegistration() {
    this.router.navigate(['register']);
  }

  public navigateToEventAdmin() {
    this.navigateToLeague('/admin/sc2');
  }

  public navigateToAppAdmin() {
    this.navigateToLeague('/admin');
  }

  /** Routes within the league site, or opens the page there when on another site. */
  private navigateToLeague(path: string) {
    if (this.location.href.startsWith(environment.ebleague)) {
      this.router.navigate([path]);
    } else {
      this.location.href = `${environment.ebleague}${path}`;
    }
  }

  private updateRegistrations(registrations: TournamentApplication []) {
    // The registrations are cached by the login service, which the local view derives from.
    this.authManager.setTournamentRegistrations(registrations);
  }
}
