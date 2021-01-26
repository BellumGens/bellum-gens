import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { EMPTY_NEW_APPLICATION, Game, GAMES } from '../../../src-common/models/tournament';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { LoginService } from '../../../src-common/services/login.service';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';
import { Router } from '@angular/router';
import { BellumgensApiService } from '../../../src-common/services/bellumgens-api.service';
import { Observable } from 'rxjs';
import { CSGOTeam } from '../../../src-common/models/csgoteam';

@Component({
  selector: 'app-tournament-registration',
  templateUrl: './tournament-registration.component.html',
  styleUrls: ['./tournament-registration.component.scss']
})
export class TournamentRegistrationComponent {
  @Input()
  public tournamentId: string;

  @ViewChild('appDetails', { static: true })
  public appDetails: ElementRef;

  public application = Object.assign({}, EMPTY_NEW_APPLICATION);
  public authUser: ApplicationUser;
  public companies: string [];
  public games = GAMES;
  public gameEnum = Game;
  public inProgress = false;
  public userTeams: Observable<CSGOTeam []>;

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private userService: BellumgensApiService,
              private router: Router) {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.authUser = user;
        this.application.email = user.email;
      }
    });
    this.apiService.companies.subscribe(data => this.companies = data);
  }

  public leagueRegistration() {
    this.inProgress = true;
    this.application.tournamentId = this.tournamentId;
    this.apiService.leagueRegistration(this.application).subscribe(application => {
      this.inProgress = false;
      this.application = application;
      this.router.navigate(['/registration-success'], { state: application });
    },
    () => this.inProgress = false);
  }

  public selectGame(game: Game) {
    if (this.authUser) {
      this.application.game = game;
      const element = document.getElementById('registration');
      element.scrollIntoView({ behavior: 'smooth' });
      this.showDetails();
    }
  }

  public showDetails() {
    if (this.application.game !== null) {
      this.appDetails.nativeElement.classList.add('application-details-show');
      if (this.application.game === Game.CSGO) {
        this.userTeams = this.userService.getUserTeams(this.authUser.id);
      } else if (this.application.game === Game.StarCraft2) {
        this.application.battleNetId = this.authUser.battleNetId;
      }
    }
  }

  public scrollToTerms(event: MouseEvent) {
    const element = document.getElementById('terms');
    element.scrollIntoView({ behavior: 'smooth' });
    event.stopPropagation();
  }
}
