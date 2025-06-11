import { Component, inject } from '@angular/core';
import { BaseDirective } from '../../../../../bellumgens/src/app/base/base.component';
import {
  ApplicationUser,
  ApiTournamentsService,
  LoginService,
  TournamentParticipant, TournamentGroup, Tournament,
  TournamentSC2Match
} from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';
import { Sc2MapNamePipe } from '../../../../../common/src/lib/pipes/sc2-map-name.pipe';
import { DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES, IgxCircularProgressBarComponent, IgxAvatarComponent, IgxBadgeComponent, IgxDividerDirective, IGX_GRID_DIRECTIVES, IgxIconComponent } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-tournament-sc2',
  templateUrl: './tournament-sc2.component.html',
  styleUrls: ['./tournament-sc2.component.scss'],
  imports: [
    DatePipe,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IgxBadgeComponent,
    IgxDividerDirective,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    Sc2MapNamePipe
  ]
})
export class TournamentSc2Component extends BaseDirective {
  private apiService = inject(ApiTournamentsService);
  private loginService = inject(LoginService);

  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public loading = false;
  public loadingMatches = false;
  public loadingGroups = false;
  public authUser: ApplicationUser;
  public tournamentId: string;
  public environment = environment;
  public sc2matches: TournamentSC2Match [];
  public tournament: Tournament;

  constructor() {
    super();
    this.loginService.applicationUser.subscribe(user => this.authUser = user);

    this.activeRoute.params.subscribe(params => {
      this.tournamentId = params['tournamentid'];
      this.apiService.getTournament(this.tournamentId).subscribe(t => this.tournament = t);
      this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
      this.apiService.getSc2Registrations(this.tournamentId).subscribe(data => this.registrations = data);
      this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
      this.apiService.getSc2Matches(this.tournamentId).subscribe(data => {
        if (data) {
          this.sc2matches = data;
        }
      });
      this.apiService.loadingSC2Groups.subscribe(data => this.loadingGroups = data);
      this.apiService.getSc2Groups(this.tournamentId).subscribe(data => this.groups = data);
    });
  }

}
