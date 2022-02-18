import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TournamentApplication } from '../../../../../common/src/public_api';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent {
  public application: TournamentApplication;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav) {
      this.application = nav.extras.state as TournamentApplication;
    }
  }

}
