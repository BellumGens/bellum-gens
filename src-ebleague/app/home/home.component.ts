import { Component } from '@angular/core';
import { Game, RegistrationsCount, Tournament } from '../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from '../../../src-common/models/applicationuser';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class TournamentHomeComponent {
  public userEmail: string = null;
  public gameEnum = Game;
  public registrations: RegistrationsCount [];
  public tournament: Tournament;
  public tournamentId: string;
  public authUser: ApplicationUser;
  public regDealine = '14ти септември 2020';
  public compStart = '28ми септември 2020';

  constructor(private apiService: ApiTournamentsService,
              private authManager: LoginService) {
    this.apiService.activeTournament.subscribe(data => {
      if (data) {
        this.tournament = data;
        this.tournamentId = data.id;
        this.apiService.getRegistrationsCount(data.id);
      }
    });
    this.apiService.registrationsCount.subscribe(data => this.registrations = data);
    this.authManager.applicationUser.subscribe(user => this.authUser = user);
  }

  public openLogin(title?: string) {
    this.authManager.emitOpenLogin(title);
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }
}
