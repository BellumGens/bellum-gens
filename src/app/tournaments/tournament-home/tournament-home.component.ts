import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { Title, Meta } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CommunicationService } from '../../services/communication.service';
import { Game, getEmptyNewApplication, GAMES } from '../../models/tournament';
import { ApiTournamentsService } from '../../services/bellumgens-api.tournaments.service';
import { LoginDialogComponent } from '../../login/login-dialog/login-dialog.component';
import { IgxDialogComponent } from 'igniteui-angular';

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

  @ViewChild('appDetails', { static: true })
  public appDetails: ElementRef;

  @ViewChild('loginDialog', { static: true })
  public loginDialog: LoginDialogComponent;

  @ViewChild('successMsg', { static: true })
  public successDialog: IgxDialogComponent;

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private commService: CommunicationService,
              private title: Title,
              private meta: Meta) {
    super();
    this.title.setTitle('Esports Business League: Sign-up');
    this.meta.updateTag({ name: 'description', content: 'Esports competition in business | Esports бизнес лига записване'});
    this.meta.updateTag({ name: 'twitter:title', content: 'Esports Business League | Esports бизнес лига'});
    this.meta.updateTag({ name: 'twitter:description', content: 'Esports competition in business | Esports бизнес лига записване'});
    if (window) {
      this.commService.title = window.matchMedia('(min-width: 768px)').matches ? this.headerTitle : this.headerTitleShort;
    } else {
      this.commService.title = this.headerTitle;
    }
    this.subs.push(
      this.authManager.applicationUser.subscribe(user => this.authUser = user),
      this.authManager.userCheckInProgress.subscribe(value => this.userCheck = value),
      this.apiService.companies.subscribe(data => this.companies = data)
    );
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }

  public leagueRegistration() {
    this.apiService.leagueRegistration(this.application).subscribe(application => {
      this.application = application;
      this.apiService.updateRegistrations();
      this.successDialog.open();
    });
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

  @HostListener('window:resize')
  public resize() {
    this.commService.title = window.matchMedia('(min-width: 768px)').matches ? this.headerTitle : this.headerTitleShort;
  }
}
