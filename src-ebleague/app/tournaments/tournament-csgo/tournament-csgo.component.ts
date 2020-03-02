import { Component } from '@angular/core';
import { TournamentRegistration, TournamentGroup } from '../../../../src-common/models/tournament';
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
  public registrations: TournamentRegistration [];
  public groups: TournamentGroup [];
  public loading = false;
  public authUser: ApplicationUser;
  public environment = environment;
  public scheduleWeek = '/assets/calendar/csgo-week5.png';

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.meta.updateTag({ name: 'og:image', content: this.scheduleWeek });
    this.meta.updateTag({ name: 'twitter:image', content: this.scheduleWeek });
    this.subs.push(
      this.apiService.csgoRegistrations.subscribe(data => this.registrations = data),
      this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data),
      this.loginService.applicationUser.subscribe(user => this.authUser = user)
    );
    this.apiService.getCSGOGroups().subscribe(data => this.groups = data);
  }

}
