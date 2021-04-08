import { Component } from '@angular/core';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../../src-common/services/login.service';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TournamentParticipant, TournamentGroup } from '../../../../src-common/models/tournament';
import { environment } from '../../../../src-common/environments/environment';
import { TournamentSC2Match } from '../../../../src-common/models/tournament-schedule';

@Component({
  selector: 'app-tournament-sc2',
  templateUrl: './tournament-sc2.component.html',
  styleUrls: ['./tournament-sc2.component.scss']
})
export class TournamentSc2Component extends BaseComponent {
  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public loading = false;
  public loadingMatches = false;
  public authUser: ApplicationUser;
  public tournamentId: string;
  public environment = environment;
  public sc2matches: TournamentSC2Match [];

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.loginService.applicationUser.subscribe(user => this.authUser = user);

    this.activeRoute.params.subscribe(params => {
      this.tournamentId = params['tournamentid'];
      this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
      this.apiService.getSc2Registrations(this.tournamentId).subscribe(data => this.registrations = data);
      this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
      this.apiService.getSc2Matches(this.tournamentId).subscribe(data => {
        if (data) {
          this.sc2matches = data;
        }
      });
      this.apiService.getSC2Groups(this.tournamentId).subscribe(data => this.groups = data);
    });
  }

}
