import { Component } from '@angular/core';
import { TournamentParticipant, TournamentGroup, Tournament } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { environment } from '../../../../src-common/environments/environment';
import { TournamentCSGOMatch } from '../../../../src-common/models/tournament-schedule';

@Component({
  selector: 'app-tournament-csgo',
  templateUrl: './tournament-csgo.component.html',
  styleUrls: ['./tournament-csgo.component.scss']
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
