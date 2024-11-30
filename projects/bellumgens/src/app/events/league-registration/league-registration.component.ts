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
  IgxIconComponent
} from '@infragistics/igniteui-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-league-registration',
  templateUrl: './league-registration.component.html',
  styleUrls: ['./league-registration.component.scss'],
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
    { name: $localize`Albania`, value: `Albania` },
    { name: $localize`Bosnia and Herzegovina`, value: `Bosnia and Herzegovina` },
    { name: $localize`Bulgaria`, value: `Bulgaria` },
    { name: $localize`Croatia`, value: `Croatia` },
    { name: $localize`Greece`, value: `Greece` },
    { name: $localize`Kosovo`, value: `Kosovo` },
    { name: $localize`Montenegro`, value: `Montenegro` },
    { name: $localize`North Macedonia`, value: `North Macedonia` },
    { name: $localize`Romania`, value: `Romania` },
    { name: $localize`Serbia`, value: `Serbia` },
    { name: $localize`Slovenia`, value: `Slovenia` }
  ];

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private commService: CommunicationService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      if (params.tournamentId) {
        this.tournamentId = params.tournamentId;
        this.apiService.getTournament(params.tournamentId).subscribe(tournament => {
          this.tournament = tournament;
          this.application.tournamentId = tournament.id;
        });
      } else {
        this.apiService.activeTournament.subscribe(data => {
          if (data) {
            this.tournament = data;
            this.tournamentId = data.id;
            this.application.tournamentId = data.id;
          }
        });
      }
    });
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.authUser = user;
        this.authManager.getRegistration(this.tournamentId).subscribe(data => {
          if (data) {
            this.application = data;
          } else {
            this.application.email = user.email;
            this.application.battleNetId = user.sc2Details?.battleNetBattleTag;
            this.application.country = user.steamUser?.country;
          }
        });
      }
    });
    this.apiService.companies.subscribe(data => this.companies = data);
  }

  public leagueRegistration() {
    this.inProgress = true;
    this.apiService.bgeRegistration(this.application, this.application.id).subscribe({
      next: (application) => {
        if (!this.application.id) {
          this.application = application;
          this.commService.emitSuccess($localize`Registration successful!`);
        } else {
          this.commService.emitSuccess($localize`Registration updated successfully!`);
        }
      },
      error: (error) => {
        this.inProgress = false;
        this.commService.emitError(error.message);
      },
      complete: () => this.inProgress = false
    });
  }
}
