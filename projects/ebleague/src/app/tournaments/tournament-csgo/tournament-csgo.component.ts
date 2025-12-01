import { Component, inject } from '@angular/core';
import {
  TournamentParticipant, TournamentGroup, Tournament,
  ApiTournamentsService,
  LoginService,
  ApplicationUser,
  TournamentCSGOMatch
} from '../../../../../common/src/public_api';
import { BaseDirective } from '../../../../../bellumgens/src/app/base/base.component';
import { environment } from '../../../../../common/src/environments/environment';
import { CSGOMapnamePipe } from '../../../../../common/src/lib/pipes/csgomapname.pipe';
import { CSGOMapimagePipe } from '../../../../../common/src/lib/pipes/csgomapimage.pipe';
import { DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IgxDividerDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
  selector: 'app-tournament-csgo',
  templateUrl: './tournament-csgo.component.html',
  styleUrls: ['./tournament-csgo.component.scss'],
  imports: [
    DatePipe,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IgxBadgeComponent,
    IgxDividerDirective,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    CSGOMapimagePipe,
    CSGOMapnamePipe
  ]
})
export class TournamentCsgoComponent extends BaseDirective {
  private apiService = inject(ApiTournamentsService);
  private loginService = inject(LoginService);

  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public loading = false;
  public loadingMatches = false;
  public authUser: ApplicationUser;
  public tournamentId: string;
  public environment = environment;
  public csgomatches: TournamentCSGOMatch [];
  public tournament: Tournament;

  constructor() {
    super();
    this.loginService.applicationUser.subscribe(user => this.authUser = user);

    this.activeRoute.params.subscribe(params => {
      this.tournamentId = params['tournamentid'];
      this.apiService.getTournament(this.tournamentId).subscribe(t => this.tournament = t);
      this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data);
      this.apiService.getCsgoRegistrations(this.tournamentId).subscribe(data => this.registrations = data);
      this.apiService.loadingCSGOMatches.subscribe(data => this.loadingMatches = data);
      this.apiService.getCsgoMatches(this.tournamentId).subscribe(data => {
        if (data) {
          this.csgomatches = data;
        }
      });
      this.apiService.getCsgoGroups(this.tournamentId).subscribe(data => this.groups = data);
    });
  }
}
