import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { Title, Meta } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CommunicationService } from '../../services/communication.service';
import { Game, getEmptyNewApplication } from '../../models/tournament';
import { ApiTournamentsService } from '../../services/bellumgens-api.tournaments.service';
import { LoginDialogComponent } from '../../login/login-dialog/login-dialog.component';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss']
})
export class TournamentHomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public userEmail: string = null;
  public headerTitle = 'Esports Business League';
  public headerTitleShort = 'EBL';
  public application = getEmptyNewApplication();
  public companies: string [];
  public games = [
    { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
    { name: 'StarCraft II', id: Game.StarCraft2 }
  ];
  public gameEnum = Game;

  @ViewChild('appDetails', { static: true })
  public appDetails: ElementRef;

  @ViewChild('loginDialog', { static: true })
  public loginDialog: LoginDialogComponent;

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
      this.apiService.companies.subscribe(data => this.companies = data)
    );
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }

  public selectGame(game: Game) {
    if (!this.authUser) {
      this.loginDialog.openLogin('You need to login first');
    } else {
      this.application.Game = game;
      window.scroll({ top: 500, behavior: 'smooth' });
      this.showDetails();
    }
  }

  public showDetails() {
    if (this.application.Game !== null) {
      this.appDetails.nativeElement.classList.add('application-details-show');
    }
  }

  @HostListener('window:resize')
  public resize() {
    this.commService.title = window.matchMedia('(min-width: 768px)').matches ? this.headerTitle : this.headerTitleShort;
  }
}
