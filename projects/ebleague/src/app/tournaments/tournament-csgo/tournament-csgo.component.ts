import { Component } from '@angular/core';
import {
  TournamentParticipant, TournamentGroup, Tournament,
  ApiTournamentsService,
  LoginService,
  ApplicationUser,
  TournamentCSGOMatch
} from '../../../../../common/src/public_api';
import { BaseDirective } from '../../../../../bellumgens/src/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../common/src/environments/environment';
import { CSGOMapnamePipe } from '../../../../../common/src/lib/pipes/csgomapname.pipe';
import { CSGOMapimagePipe } from '../../../../../common/src/lib/pipes/csgomapimage.pipe';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { IGX_CARD_DIRECTIVES, IgxCircularProgressBarComponent, IgxAvatarComponent, IgxBadgeComponent, IgxDividerDirective, IGX_GRID_DIRECTIVES, IgxIconComponent } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-tournament-csgo',
  templateUrl: './tournament-csgo.component.html',
  styleUrls: ['./tournament-csgo.component.scss'],
  imports: [
    NgOptimizedImage,
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
  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public loading = false;
  public loadingMatches = false;
  public authUser: ApplicationUser;
  public tournamentId: string;
  public environment = environment;
  public csgomatches: TournamentCSGOMatch [];
  public tournament: Tournament;

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
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
