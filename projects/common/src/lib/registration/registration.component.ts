import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';

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

  @ViewChild('regusername', { static: true }) public usernameInput: ElementRef;

  public userAccount: UserRegistration = { username: '', password: '', confirmPassword: '', email: '' };
  public inUse = false;
  public submitInProgress = false;
  public authUser: ApplicationUser;
  public error = '';

  constructor() {
    this.authManager.applicationUser.subscribe(user => {
      this.authUser = user;
      if (user && user.email) {
        this.userAccount.email = user.email;
        this.userAccount.username = user.username;
      }
    });
  }

  public ngOnInit() {
    this.initUsernameCheck();
  }

  public submitRegistration() {
    this.submitInProgress = true;
    this.authManager.submitRegistration(this.userAccount).subscribe({
      next: () => {
        this.submitInProgress = false;
        this.router.navigate(['/']);
      },
      error: error => {
        this.error = error.message;
        this.submitInProgress = false;
      }
    });
  }

  private initUsernameCheck() {
    const input = fromEvent(this.usernameInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (e.currentTarget as HTMLInputElement).value));
    const debouncedInput = input.pipe(debounceTime(300));
    debouncedInput.subscribe(val => {
      this.authManager.checkUsername(val).subscribe(data => {
        if (this.authUser && this.userAccount.username === this.authUser.username) {
          return;
        }
        this.inUse = data;
      });
    });
  }
}


