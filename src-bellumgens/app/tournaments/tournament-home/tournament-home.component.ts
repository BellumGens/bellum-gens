import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { Title, Meta } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CommunicationService } from '../../services/communication.service';
import { Game, getEmptyNewApplication, GAMES, RegistrationsCount } from '../../models/tournament';
import { ApiTournamentsService } from '../../services/bellumgens-api.tournaments.service';
import { LoginDialogComponent } from '../../login/login-dialog/login-dialog.component';
import { IgxDialogComponent } from 'igniteui-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss']
})
export class TournamentHomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public userCheck = false;
  public userEmail: string = null;
  public headerTitle = 'Esports Business League';
  public headerTitleShort = 'EBL';
  public application = getEmptyNewApplication();
  public companies: string [];
  public games = GAMES;
  public gameEnum = Game;
  public bankaccountinfo = {
    bank: 'ОББ',
    name: 'Белум Генс',
    bic: 'UBBSBGSF',
    account: 'BG90UBBS80021087375040'
  };
  public inProgress = false;
  public registrations: RegistrationsCount [];
  public pipeTrigger = 0;

  @ViewChild('appDetails', { static: true })
  public appDetails: ElementRef;

  @ViewChild('loginDialog', { static: true })
  public loginDialog: LoginDialogComponent;

  @ViewChild('successMsg', { static: true })
  public successDialog: IgxDialogComponent;

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private commService: CommunicationService,
              activeRoute: ActivatedRoute,
              title: Title,
              meta: Meta) {
    super(title, meta, activeRoute);
    this.subs.push(
      this.authManager.applicationUser.subscribe(user => this.authUser = user),
      this.authManager.userCheckInProgress.subscribe(value => this.userCheck = value),
      this.apiService.companies.subscribe(data => this.companies = data),
      this.apiService.registrationsCount.subscribe(data => this.registrations = data)
    );
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }

  public leagueRegistration() {
    this.inProgress = true;
    this.apiService.leagueRegistration(this.application).subscribe(application => {
      this.inProgress = false;
      this.application = application;
      if (this.registrations) {
        this.registrations.find(r => r.game === application.Game).count++;
        this.pipeTrigger++;
      }
      this.apiService.updateRegistrations();
      this.successDialog.open();
    },
    _ => this.inProgress = false);
  }

  public selectGame(game: Game) {
    if (!this.authUser) {
      this.loginDialog.openLogin('Трябва първо да влезете с профила си');
    } else {
      this.application.Game = game;
      const element = document.getElementById('registration');
      element.scrollIntoView({ behavior: 'smooth' });
      this.showDetails();
    }
  }

  public showDetails() {
    if (this.application.Game !== null) {
      this.appDetails.nativeElement.classList.add('application-details-show');
    }
  }

  public scrollToTerms(event: MouseEvent) {
    const element = document.getElementById('terms');
    element.scrollIntoView({ behavior: 'smooth' });
    event.stopPropagation();
  }
}
