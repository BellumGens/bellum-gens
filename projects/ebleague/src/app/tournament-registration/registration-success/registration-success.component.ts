import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Game, TournamentApplication } from 'bellum-gens-common/models';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss'],
  imports: [RouterLink]
})
export class RegistrationSuccessComponent {
  private router = inject(Router);

  public readonly application: TournamentApplication | null = this.getApplication();
  /** No fee has been published for the Dota 2 league, so its registrants are not quoted an amount. */
  public readonly feeKnown = this.application?.game !== Game.Dota2;

  private getApplication(): TournamentApplication | null {
    const state = this.router.currentNavigation()?.extras.state as TournamentApplication | undefined;
    return state?.hash ? state : null;
  }
}
