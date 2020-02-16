import { Component } from '@angular/core';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../../src-common/services/login.service';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TournamentRegistration, TournamentGroup } from '../../../../src-common/models/tournament';
import { environment } from '../../../../src-common/environments/environment';

@Component({
  selector: 'app-tournament-sc2',
  templateUrl: './tournament-sc2.component.html',
  styleUrls: ['./tournament-sc2.component.scss']
})
export class TournamentSc2Component extends BaseComponent {
  public registrations: TournamentRegistration [];
  public groups: TournamentGroup [];
  public loading = false;
  public authUser: ApplicationUser;
  public environment = environment;
  public scheduleWeek = '/assets/calendar/sc2-week4.webp';
  public scheduleAlt = 'График StarCraft II Лига, Седмица 4';

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.meta.updateTag({ name: 'og:image', content: this.scheduleWeek });
    this.meta.updateTag({ name: 'twitter:image', content: this.scheduleWeek });
    this.subs.push(
      this.apiService.sc2Registrations.subscribe(data => this.registrations = data),
      this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data),
      this.loginService.applicationUser.subscribe(user => this.authUser = user)
    );
    this.apiService.getSC2Groups().subscribe(data => this.groups = data);
  }

}
