import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserLogin } from '../../models/userlogin';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'bg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public userAccount: UserLogin = { username: '', password: '', email: '' };
  public inUse = false;
  public submitInProgress = false;

  @ViewChild('userName', { static: true }) public usernameInput: ElementRef;

  constructor(private authManager: LoginService) { }

  public ngOnInit() {
    this.initUsernameCheck();
  }

  public submitRegistration() {

  }

  private initUsernameCheck() {
    const input = fromEvent(this.usernameInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (<HTMLInputElement>e.currentTarget).value));
    const debouncedInput = input.pipe(debounceTime(300));
    debouncedInput.subscribe(val => {
      this.authManager.checkUsername(val).subscribe(data => this.inUse = data);
    });
  }
}
