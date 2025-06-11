import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TournamentApplication } from '../../../../../common/src/public_api';

@Component({
    selector: 'app-registration-success',
    templateUrl: './registration-success.component.html',
    styleUrls: ['./registration-success.component.scss'],
    standalone: true
})
export class RegistrationSuccessComponent {
  private router = inject(Router);

  public application: TournamentApplication;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    if (nav) {
      this.application = nav.extras.state as TournamentApplication;
    }
  }

}
