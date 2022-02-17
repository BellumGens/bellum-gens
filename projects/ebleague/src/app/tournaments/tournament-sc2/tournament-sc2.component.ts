import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../projects/bellumgens/src/app/base/base.component';
import {
  ApplicationUser,
  ApiTournamentsService,
  LoginService,
  TournamentParticipant, TournamentGroup, Tournament,
  TournamentSC2Match
} from '../../../../../common/src/public_api';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../common/src/environments/environment';

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
      this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
      this.apiService.getSc2Registrations(this.tournamentId).subscribe(data => this.registrations = data);
      this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
      this.apiService.getSc2Matches(this.tournamentId).subscribe(data => {
        if (data) {
          this.sc2matches = data;
        }
      });
      this.apiService.getSc2Groups(this.tournamentId).subscribe(data => this.groups = data);
    });
  }

}
