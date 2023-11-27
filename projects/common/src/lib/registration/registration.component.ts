import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { LoginService } from '../../services/login.service';
import { UserRegistration } from '../../models/userlogin';
import { ApplicationUser } from '../../models/applicationuser';

import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IgxButtonModule, IgxIconModule, IgxInputGroupModule, IgxRippleModule } from '@infragistics/igniteui-angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'bg-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    standalone: true,
    imports: [FormsModule, IgxInputGroupModule, IgxIconModule, NgIf, IgxButtonModule, IgxRippleModule]
})
export class RegistrationComponent implements OnInit {
  @ViewChild('regusername', { static: true }) public usernameInput: ElementRef;

  public userAccount: UserRegistration = { username: '', password: '', confirmPassword: '', email: '' };
  public inUse = false;
  public submitInProgress = false;
  public authUser: ApplicationUser;
  public error = '';

  constructor(private authManager: LoginService, private router: Router) {
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
    this.authManager.submitRegistration(this.userAccount).subscribe({
      next: () => this.router.navigate(['/']),
      error: error => this.error = error.error[''].join(' ')
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


