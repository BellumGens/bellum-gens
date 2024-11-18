import { Component } from '@angular/core';
import {
  ApplicationUser,
  LoginService,
  ApiTournamentsService,
  StartsWithPipe,
  TournamentApplication,
  Game,
  CountrySVGPipe,
  Tournament,
  CommunicationService,
  BATTLE_TAG_REGEX,
  EMAIL_REGEX
} from '../../../../../common/src/public_api';
import { FormsModule } from '@angular/forms';
import {
  IGX_DRAG_DROP_DIRECTIVES,
  IGX_DROP_DOWN_DIRECTIVES,
  IGX_INPUT_GROUP_DIRECTIVES,
  IGX_SELECT_DIRECTIVES,
  IgxAutocompleteDirective,
  IgxAvatarComponent,
  IgxButtonDirective,
  IgxCheckboxComponent,
  IgxDialogComponent,
  IgxDividerDirective,
  IgxIconComponent
} from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-league-registration',
  templateUrl: './league-registration.component.html',
  styleUrls: ['./league-registration.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    IgxAutocompleteDirective,
    IGX_DROP_DOWN_DIRECTIVES,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxDialogComponent,
    IgxCheckboxComponent,
    IgxButtonDirective,
    IgxDividerDirective,
    IGX_SELECT_DIRECTIVES,
    IgxAvatarComponent,
    StartsWithPipe,
    CountrySVGPipe
  ]
})
export class LeagueRegistrationComponent {
  public application: TournamentApplication = { game: Game.StarCraft2, email: '' };
  public tournamentId: string;
  public tournament: Tournament;
  public authUser: ApplicationUser;
  public companies: string [];
  public inProgress = false;
  public battleTagRegex = BATTLE_TAG_REGEX;
  public emailRegex = EMAIL_REGEX;

  public loginFirst = $localize`Please login first`;
  public balkanCountries = [
    $localize`Albania`,
    $localize`Bosnia and Herzegovina`,
    $localize`Bulgaria`,
    $localize`Croatia`,
    $localize`Greece`,
    $localize`Kosovo`,
    $localize`Montenegro`,
    $localize`North Macedonia`,
    $localize`Romania`,
    $localize`Serbia`,
    $localize`Slovenia`,
  ];

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private commService: CommunicationService) {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.authUser = user;
        this.application.email = user.email;
        this.application.battleNetId = user.sc2Details?.battleNetBattleTag;
        this.application.country = user.steamUser?.country;
      }
    });
    this.apiService.activeTournament.subscribe(data => {
      if (data) {
        this.tournament = data;
        this.application.tournamentId = data.id;
      }
    });
    this.apiService.companies.subscribe(data => this.companies = data);
  }

  public leagueRegistration() {
    this.inProgress = true;
    this.apiService.bgeRegistration(this.application).subscribe({
      next: (application) => {
        this.application = application;
        this.commService.emitSuccess($localize`Registration successful!`);
      },
      error: (error) => {
        this.inProgress = false;
        this.commService.emitError(error.message);
      },
      complete: () => this.inProgress = false
    });
  }
}
