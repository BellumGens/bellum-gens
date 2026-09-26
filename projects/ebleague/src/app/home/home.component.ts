import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, Signal, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxDividerComponent } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import {
  Game, RegistrationsCount, Tournament,
  ApiTournamentsService,
  LoginService,
  ApplicationUser,
  SocialMediaService
} from '../../../../common/src/public_api';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    // TournamentRegistrationComponent,
    IgxButtonDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IGX_INPUT_GROUP_DIRECTIVES
  ]
})
export class HomeComponent {
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiTournamentsService);
  private socialMedia = inject(SocialMediaService);
  private authManager = inject(LoginService);

  public userEmail = signal('');
  public gameEnum = Game;
  // The active tournament and its registration counts are only loaded in the browser.
  public registrations: Signal<RegistrationsCount []> = this.apiService.registrationsCount;
  public tournament: Signal<Tournament> = isPlatformBrowser(this.platformId)
    ? this.apiService.activeTournament
    : signal<Tournament>(null).asReadonly();
  public tournamentId = computed(() => this.tournament()?.id ?? null);
  // The user is only looked up in the browser.
  public authUser: Signal<ApplicationUser> = isPlatformBrowser(this.platformId)
    ? this.authManager.applicationUser
    : signal<ApplicationUser>(null).asReadonly();

  constructor() {
    effect(() => {
      const tournamentId = this.tournamentId();
      if (tournamentId) {
        untracked(() => this.apiService.getRegistrationsCount(tournamentId));
      }
    });
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public subscribe() {
    const email = this.userEmail();
    if (email) {
      this.authManager.addSubscriber(email).subscribe();
    }
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @EsportBLeague ...');
  }
}
