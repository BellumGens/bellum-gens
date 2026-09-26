import { Component, DestroyRef, ElementRef, OnInit, Signal, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LoginService } from '../../services/login.service';
import { UserRegistration } from '../../models/userlogin';
import { ApplicationUser } from '../../models/applicationuser';

import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
  selector: 'bg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [FormsModule, IGX_INPUT_GROUP_DIRECTIVES, IgxIconComponent, IgxButtonDirective, IgxRippleDirective]
})
export class RegistrationComponent implements OnInit {
  private authManager = inject(LoginService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public usernameInput = viewChild.required<ElementRef<HTMLInputElement>>('regusername');

  public userAccount = signal<UserRegistration>({ username: '', password: '', confirmPassword: '', email: '' });
  public inUse = signal(false);
  public submitInProgress = signal(false);
  public authUser: Signal<ApplicationUser | null> = this.authManager.applicationUser;
  public error = signal('');

  constructor() {
    effect(() => {
      const user = this.authUser();
      if (user && user.email) {
        untracked(() => this.userAccount.update(account => ({ ...account, email: user.email, username: user.username })));
      }
    });
  }

  public ngOnInit() {
    this.initUsernameCheck();
  }

  public updateAccount(field: keyof UserRegistration, value: string) {
    this.userAccount.update(account => ({ ...account, [field]: value }));
  }

  public submitRegistration() {
    this.submitInProgress.set(true);
    this.authManager.submitRegistration(this.userAccount()).subscribe({
      next: () => {
        this.submitInProgress.set(false);
        this.router.navigate(['/']);
      },
      error: error => {
        this.error.set(error.message);
        this.submitInProgress.set(false);
      }
    });
  }

  private initUsernameCheck() {
    const input = fromEvent(this.usernameInput().nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (e.currentTarget as HTMLInputElement).value));
    const debouncedInput = input.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef));
    debouncedInput.subscribe(val => {
      this.authManager.checkUsername(val).subscribe(data => {
        const authUser = this.authUser();
        if (authUser && this.userAccount().username === authUser.username) {
          return;
        }
        this.inUse.set(data);
      });
    });
  }
}
