import { Component, ViewChild } from '@angular/core';
import { Game, RegistrationsCount } from '../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';
import { LoginDialogComponent } from '../../../src-bellumgens/app/login/login-dialog/login-dialog.component';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss']
})
export class TournamentHomeComponent {
  public userEmail: string = null;
  public gameEnum = Game;
  public registrations: RegistrationsCount [];

  @ViewChild('loginDialog', { static: true })
  public loginDialog: LoginDialogComponent;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.registrationsCount.subscribe(data => this.registrations = data);
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }
}
