import { Component, Signal, effect, inject, input, signal, untracked } from '@angular/core';
import {
  EMPTY_NEW_APPLICATION, Game, GAMES,
  ApplicationUser,
  LoginService,
  ApiTournamentsService,
  BellumgensApiService,
  CSGOTeam,
  BATTLE_TAG_REGEX
} from '../../../../common/src/public_api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IGX_DRAG_DROP_DIRECTIVES } from '@infragistics/igniteui-angular/directives';
import { IGX_DROP_DOWN_DIRECTIVES, IgxAutocompleteDirective } from '@infragistics/igniteui-angular/drop-down';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { TeamNewComponent } from '../../../../bellumgens/src/app/team-section/team-new/team-new.component';
import { StartsWithPipe } from '../../../../common/src/lib/pipes/starts-with.pipe';

@Component({
  selector: 'app-tournament-registration',
  templateUrl: './tournament-registration.component.html',
  styleUrls: ['./tournament-registration.component.scss'],
  imports: [
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_SELECT_DIRECTIVES,
    IgxIconComponent,
    IgxAvatarComponent,
    IgxAutocompleteDirective,
    IGX_DROP_DOWN_DIRECTIVES,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxCheckboxComponent,
    TeamNewComponent,
    StartsWithPipe
  ]
})
export class TournamentRegistrationComponent {
  private authManager = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private userService = inject(BellumgensApiService);
  private router = inject(Router);

  public tournamentId = input<string>();

  public application = signal(Object.assign({}, EMPTY_NEW_APPLICATION));
  public authUser: Signal<ApplicationUser> = this.authManager.applicationUser;
  public companies = this.apiService.companies;
  public games = GAMES;
  public gameEnum = Game;
  public inProgress = signal(false);
  public detailsVisible = signal(false);
  public userTeams = signal<CSGOTeam []>(null);

  public chooseGame = $localize`Choose league (game)`;
  public loginFirst = $localize`Please login first`;
  public battleTagRegex = BATTLE_TAG_REGEX;

  constructor() {
    effect(() => {
      const user = this.authUser();
      if (user) {
        untracked(() => this.application.update(application => ({ ...application, email: user.email })));
      }
    });
  }

  public leagueRegistration() {
    this.inProgress.set(true);
    this.application.update(application => ({ ...application, tournamentId: this.tournamentId() }));
    this.apiService.leagueRegistration(this.application()).subscribe({
      next: (application) => {
        this.inProgress.set(false);
        this.application.set(application);
        this.router.navigate(['/registration-success'], { state: application });
      },
      complete: () => this.inProgress.set(false)
    });
  }

  public selectGame(game: Game) {
    this.application.update(application => ({ ...application, game }));
    const element = document.getElementById('registration');
    element.scrollIntoView({ behavior: 'smooth' });
    this.showDetails();
  }

  public showDetails() {
    const game = this.application().game;
    if (game !== null) {
      this.detailsVisible.set(true);
      if (game === Game.CSGO) {
        this.userService.getUserTeams(this.authUser().id).subscribe(teams => this.userTeams.set(teams));
      } else if (game === Game.StarCraft2) {
        this.application.update(application => ({ ...application, battleNetId: this.authUser().battleNetId }));
      }
    }
  }

  public scrollToTerms(event: MouseEvent) {
    const element = document.getElementById('terms');
    element.scrollIntoView({ behavior: 'smooth' });
    event.stopPropagation();
  }
}
