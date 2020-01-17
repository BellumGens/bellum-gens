import { Component } from '@angular/core';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../../src-common/services/login.service';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TournamentRegistration } from '../../../../src-common/models/tournament';
import { environment } from '../../../../src-common/environments/environment';

@Component({
  selector: 'app-tournament-sc2',
  templateUrl: './tournament-sc2.component.html',
  styleUrls: ['./tournament-sc2.component.scss']
})
export class TournamentSc2Component extends BaseComponent {
  public registrations: TournamentRegistration [];
  public loading = false;
  public authUser: ApplicationUser;
  public environment = environment;

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.subs.push(
      this.apiService.sc2Registrations.subscribe(data => this.registrations = data),
      this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data),
      this.loginService.applicationUser.subscribe(user => this.authUser = user)
    );
  }

}
