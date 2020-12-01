import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserRegistration } from '../../models/userlogin';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { ApplicationUser } from '../../models/applicationuser';
import { Router } from '@angular/router';

@Component({
  selector: 'bg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public userAccount: UserRegistration = { username: '', password: '', confirmPassword: '', email: '' };
  public inUse = false;
  public submitInProgress = false;
  public authUser: ApplicationUser;
  public error = '';

  @ViewChild('regusername', { static: true }) public usernameInput: ElementRef;

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
    this.authManager.submitRegistration(this.userAccount).subscribe(
      _ => this.router.navigate(['/']),
      error => this.error = error.error[''].join(' ')
    );
  }

  private initUsernameCheck() {
    const input = fromEvent(this.usernameInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (<HTMLInputElement>e.currentTarget).value));
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
