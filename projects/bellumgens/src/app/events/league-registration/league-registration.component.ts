import { Component, inject } from '@angular/core';
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
  private authManager = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private commService = inject(CommunicationService);
  private activatedRoute = inject(ActivatedRoute);

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
  public europeCountries = [
    { name: $localize`Albania`, value: `Albania` },
    { name: $localize`Andorra`, value: `Andorra` },
    { name: $localize`Austria`, value: `Austria` },
    { name: $localize`Belarus`, value: `Belarus` },
    { name: $localize`Belgium`, value: `Belgium` },
    { name: $localize`Bosnia and Herzegovina`, value: `Bosnia and Herzegovina` },
    { name: $localize`Bulgaria`, value: `Bulgaria` },
    { name: $localize`Croatia`, value: `Croatia` },
    { name: $localize`Cyprus`, value: `Cyprus` },
    { name: $localize`Czech Republic`, value: `Czech Republic` },
    { name: $localize`Denmark`, value: `Denmark` },
    { name: $localize`Estonia`, value: `Estonia` },
    { name: $localize`Finland`, value: `Finland` },
    { name: $localize`France`, value: `France` },
    { name: $localize`Georgia`, value: `Georgia` },
    { name: $localize`Germany`, value: `Germany` },
    { name: $localize`Greece`, value: `Greece` },
    { name: $localize`Hungary`, value: `Hungary` },
    { name: $localize`Iceland`, value: `Iceland` },
    { name: $localize`Ireland`, value: `Ireland` },
    { name: $localize`Italy`, value: `Italy` },
    { name: $localize`Kosovo`, value: `Kosovo` },
    { name: $localize`Latvia`, value: `Latvia` },
    { name: $localize`Liechtenstein`, value: `Liechtenstein` },
    { name: $localize`Lithuania`, value: `Lithuania` },
    { name: $localize`Luxembourg`, value: `Luxembourg` },
    { name: $localize`Malta`, value: `Malta` },
    { name: $localize`Moldova`, value: `Moldova` },
    { name: $localize`Monaco`, value: `Monaco` },
    { name: $localize`Montenegro`, value: `Montenegro` },
    { name: $localize`Netherlands`, value: `Netherlands` },
    { name: $localize`North Macedonia`, value: `North Macedonia` },
    { name: $localize`Norway`, value: `Norway` },
    { name: $localize`Poland`, value: `Poland` },
    { name: $localize`Portugal`, value: `Portugal` },
    { name: $localize`Romania`, value: `Romania` },
    { name: $localize`Russia`, value: `Russia` },
    { name: $localize`San Marino`, value: `San Marino` },
    { name: $localize`Serbia`, value: `Serbia` },
    { name: $localize`Slovakia`, value: `Slovakia` },
    { name: $localize`Slovenia`, value: `Slovenia` },
    { name: $localize`Spain`, value: `Spain` },
    { name: $localize`Sweden`, value: `Sweden` },
    { name: $localize`Switzerland`, value: `Switzerland` },
    { name: $localize`Ukraine`, value: `Ukraine` },
    { name: $localize`United Kingdom`, value: `United Kingdom` },
    { name: $localize`Vatican City`, value: `Vatican City` }
  ];
  public asiaCountries = [
    { name: $localize`Afghanistan`, value: `Afghanistan` },
    { name: $localize`Armenia`, value: `Armenia` },
    { name: $localize`Azerbaijan`, value: `Azerbaijan` },
    { name: $localize`Bahrain`, value: `Bahrain` },
    { name: $localize`Bangladesh`, value: `Bangladesh` },
    { name: $localize`Bhutan`, value: `Bhutan` },
    { name: $localize`Brunei`, value: `Brunei` },
    { name: $localize`Cambodia`, value: `Cambodia` },
    { name: $localize`China`, value: `China` },
    { name: $localize`Georgia`, value: `Georgia` },
    { name: $localize`India`, value: `India` },
    { name: $localize`Indonesia`, value: `Indonesia` },
    { name: $localize`Iran`, value: `Iran` },
    { name: $localize`Iraq`, value: `Iraq` },
    { name: $localize`Israel`, value: `Israel` },
    { name: $localize`Japan`, value: `Japan` },
    { name: $localize`Jordan`, value: `Jordan` },
    { name: $localize`Kazakhstan`, value: `Kazakhstan` },
    { name: $localize`Kuwait`, value: `Kuwait` },
    { name: $localize`Kyrgyzstan`, value: `Kyrgyzstan` },
    { name: $localize`Laos`, value: `Laos` },
    { name: $localize`Lebanon`, value: `Lebanon` },
    { name: $localize`Malaysia`, value: `Malaysia` },
    { name: $localize`Maldives`, value: `Maldives` },
    { name: $localize`Mongolia`, value: `Mongolia` },
    { name: $localize`Myanmar`, value: `Myanmar` },
    { name: $localize`Nepal`, value: `Nepal` },
    { name: $localize`Oman`, value: `Oman` },
    { name: $localize`Pakistan`, value: `Pakistan` },
    { name: $localize`Palestine`, value: `Palestine` },
    { name: $localize`Philippines`, value: `Philippines` },
    { name: $localize`Qatar`, value: `Qatar` },
    { name: $localize`Saudi Arabia`, value: `Saudi Arabia` },
    { name: $localize`Singapore`, value: `Singapore` },
    { name: $localize`South Korea`, value: `South Korea` },
    { name: $localize`Sri Lanka`, value: `Sri Lanka` },
    { name: $localize`Syria`, value: `Syria` },
    { name: $localize`Tajikistan`, value: `Tajikistan` },
    { name: $localize`Taiwan`, value: `Taiwan` },
    { name: $localize`Thailand`, value: `Thailand` },
    { name: $localize`Turkey`, value: `Turkey` },
    { name: $localize`Turkmenistan`, value: `Turkmenistan` },
    { name: $localize`United Arab Emirates`, value: `United Arab Emirates` },
    { name: $localize`Uzbekistan`, value: `Uzbekistan` },
    { name: $localize`Vietnam`, value: `Vietnam` },
    { name: $localize`Yemen`, value: `Yemen` }
  ];
  public americasCountries = [
    { name: $localize`Antigua and Barbuda`, value: `Antigua and Barbuda` },
    { name: $localize`Argentina`, value: `Argentina` },
    { name: $localize`Bahamas`, value: `Bahamas` },
    { name: $localize`Barbados`, value: `Barbados` },
    { name: $localize`Belize`, value: `Belize` },
    { name: $localize`Bolivia`, value: `Bolivia` },
    { name: $localize`Brazil`, value: `Brazil` },
    { name: $localize`Canada`, value: `Canada` },
    { name: $localize`Chile`, value: `Chile` },
    { name: $localize`Colombia`, value: `Colombia` },
    { name: $localize`Costa Rica`, value: `Costa Rica` },
    { name: $localize`Cuba`, value: `Cuba` },
    { name: $localize`Dominica`, value: `Dominica` },
    { name: $localize`Dominican Republic`, value: `Dominican Republic` },
    { name: $localize`Ecuador`, value: `Ecuador` },
    { name: $localize`Grenada`, value: `Grenada` },
    { name: $localize`Guatemala`, value: `Guatemala` },
    { name: $localize`Guyana`, value: `Guyana` },
    { name: $localize`Haiti`, value: `Haiti` },
    { name: $localize`Honduras`, value: `Honduras` },
    { name: $localize`Jamaica`, value: `Jamaica` },
    { name: $localize`Mexico`, value: `Mexico` },
    { name: $localize`Nicaragua`, value: `Nicaragua` },
    { name: $localize`Panama`, value: `Panama` },
    { name: $localize`Paraguay`, value: `Paraguay` },
    { name: $localize`Peru`, value: `Peru` },
    { name: $localize`Saint Kitts and Nevis`, value: `Saint Kitts and Nevis` },
    { name: $localize`Suriname`, value: `Suriname` },
    { name: $localize`Trinidad and Tobago`, value: `Trinidad and Tobago` },
    { name: $localize`United States`, value: `United States of America` },
    { name: $localize`Uruguay`, value: `Uruguay` },
    { name: $localize`Venezuela`, value: `Venezuela` }
  ];
  public oceaniaCountries = [
    { name: $localize`Australia`, value: `Australia` },
    { name: $localize`Fiji`, value: `Fiji` },
    { name: $localize`Kiribati`, value: `Kiribati` },
    { name: $localize`Marshall Islands`, value: `Marshall Islands` },
    { name: $localize`Micronesia`, value: `Micronesia` },
    { name: $localize`Nauru`, value: `Nauru` },
    { name: $localize`New Zealand`, value: `New Zealand` },
    { name: $localize`Palau`, value: `Palau` },
    { name: $localize`Papua New Guinea`, value: `Papua New Guinea` },
    { name: $localize`Samoa`, value: `Samoa` },
    { name: $localize`Solomon Islands`, value: `Solomon Islands` },
    { name: $localize`Tonga`, value: `Tonga` },
    { name: $localize`Tuvalu`, value: `Tuvalu` },
    { name: $localize`Vanuatu`, value: `Vanuatu` }
  ];

  public countriesList = this.balkanCountries;

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      if (params.tournamentId) {
        this.tournamentId = params.tournamentId;
        this.apiService.getTournament(params.tournamentId).subscribe(tournament => {
          this.tournament = tournament;
          this.application.tournamentId = tournament?.id;
          if (this.tournament?.name.includes('Europe')) {
            this.countriesList = this.europeCountries;
          } else if (this.tournament?.name.includes('Asia')) {
            this.countriesList = this.asiaCountries;
          } else if (this.tournament?.name.includes('Americas')) {
            this.countriesList = this.americasCountries;
          } else if (this.tournament?.name.includes('Wildcard')) {
            this.countriesList = [].concat(this.europeCountries, this.asiaCountries, this.americasCountries, this.oceaniaCountries).sort((a, b) => a.name > b.name ? 1 : -1);
          }
        });
      } else {
        this.apiService.activeTournament.subscribe(data => {
          this.tournament = data;
          this.tournamentId = data?.id;
          this.application.tournamentId = this.tournamentId;
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
