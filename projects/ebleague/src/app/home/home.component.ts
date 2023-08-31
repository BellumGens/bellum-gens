import { DatePipe, NgIf, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IgxButtonModule, IgxDividerModule, IgxIconModule, IgxInputGroupModule } from '@infragistics/igniteui-angular';
import {
  Game, RegistrationsCount, Tournament,
  ApiTournamentsService,
  LoginService,
  ApplicationUser,
  SocialMediaService
} from '../../../../common/src/public_api';
import { TournamentRegistrationComponent } from '../tournament-registration/tournament-registration.component';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
      NgOptimizedImage,
      NgIf,
      RouterLink,
      FormsModule,
      TournamentRegistrationComponent,
      IgxButtonModule,
      IgxDividerModule,
      IgxIconModule,
      IgxInputGroupModule,
      DatePipe
    ]
})
export class HomeComponent {
  public userEmail: string = null;
  public gameEnum = Game;
  public registrations: RegistrationsCount [];
  public tournament: Tournament;
  public tournamentId: string;
  public authUser: ApplicationUser;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private apiService: ApiTournamentsService,
              private socialMedia: SocialMediaService,
              private authManager: LoginService) {
    if (isPlatformBrowser(this.platformId)) {
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
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public scrollTo(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  public subscribe() {
    if (this.userEmail) {
      this.authManager.addSubscriber(this.userEmail).subscribe();
    }
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @EsportBLeague ...');
  }
}
