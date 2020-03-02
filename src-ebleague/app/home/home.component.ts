import { Component } from '@angular/core';
import { Game, RegistrationsCount } from '../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class TournamentHomeComponent {
  public userEmail: string = null;
  public gameEnum = Game;
  public registrations: RegistrationsCount [];

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.registrationsCount.subscribe(data => this.registrations = data);
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }
}
