import { Component } from '@angular/core';
import { TournamentCSGORegistration } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { environment } from '../../../../src-common/environments/environment';

@Component({
  selector: 'app-tournament-csgo',
  templateUrl: './tournament-csgo.component.html',
  styleUrls: ['./tournament-csgo.component.scss']
})
export class TournamentCsgoComponent extends BaseComponent {
  public registrations: TournamentCSGORegistration [];
  public authUser: ApplicationUser;
  public environment = environment;

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.subs.push(
      this.apiService.csgoRegistrations.subscribe(data => this.registrations = data),
      this.loginService.applicationUser.subscribe(user => this.authUser = user)
    );
  }

}
