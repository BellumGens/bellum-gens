import { Component } from '@angular/core';
import {
  TournamentParticipant, TournamentGroup, Tournament,
  ApiTournamentsService,
  LoginService,
  ApplicationUser,
  TournamentCSGOMatch
} from '../../../../../common/src/public_api';
import { BaseComponent } from '../../../../../bellumgens/src/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../common/src/environments/environment';
import { CSGOMapnamePipe } from '../../../../../common/src/lib/pipes/csgomapname.pipe';
import { CSGOMapimagePipe } from '../../../../../common/src/lib/pipes/csgomapimage.pipe';
import { NgIf, NgFor, DatePipe, NgOptimizedImage } from '@angular/common';
import { IgxCardModule, IgxProgressBarModule, IgxAvatarModule, IgxBadgeModule, IgxDividerModule, IgxGridModule, IgxIconModule } from '@infragistics/igniteui-angular';

@Component({
    selector: 'app-tournament-csgo',
    templateUrl: './tournament-csgo.component.html',
    styleUrls: ['./tournament-csgo.component.scss'],
    standalone: true,
    imports: [
      NgIf,
      NgFor,
      NgOptimizedImage,
      DatePipe,
      IgxCardModule,
      IgxProgressBarModule,
      IgxAvatarModule,
      IgxBadgeModule,
      IgxDividerModule,
      IgxGridModule,
      IgxIconModule,
      CSGOMapimagePipe,
      CSGOMapnamePipe
    ]
})
export class TournamentCsgoComponent extends BaseComponent {
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
