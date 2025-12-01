import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxDividerDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import {
  Game, RegistrationsCount, Tournament,
  ApiTournamentsService,
  LoginService,
  ApplicationUser,
  SocialMediaService
} from '../../../../common/src/public_api';
// import { TournamentRegistrationComponent } from '../tournament-registration/tournament-registration.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    // TournamentRegistrationComponent,
    IgxButtonDirective,
    IgxDividerDirective,
    IgxIconComponent,
    IGX_INPUT_GROUP_DIRECTIVES
  ]
})
export class HomeComponent {
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiTournamentsService);
  private socialMedia = inject(SocialMediaService);
  private authManager = inject(LoginService);

  public userEmail: string = null;
  public gameEnum = Game;
  public registrations: RegistrationsCount [];
  public tournament: Tournament;
  public tournamentId: string;
  public authUser: ApplicationUser;

  constructor() {
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
