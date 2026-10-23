import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TournamentApplication } from '../../../../../common/src/public_api';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss'],
  imports: [RouterLink]
})
export class RegistrationSuccessComponent {
  private router = inject(Router);

  public readonly application: TournamentApplication | null = this.getApplication();

  private getApplication(): TournamentApplication | null {
    const state = this.router.currentNavigation()?.extras.state as TournamentApplication | undefined;
    return state?.hash ? state : null;
  }
}
