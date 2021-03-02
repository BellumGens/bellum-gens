import { Component } from '@angular/core';
import { TournamentParticipant, TournamentGroup } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { environment } from '../../../../src-common/environments/environment';
import { DataType, GridSelectionMode } from '@infragistics/igniteui-angular';
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
  public selectionMode = GridSelectionMode;
  public gridDataType = DataType;
  public csgomatches: TournamentCSGOMatch [];

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.loginService.applicationUser.subscribe(user => this.authUser = user);

    this.activeRoute.params.subscribe(params => {
      this.tournamentId = params['tournamentid'];
      this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data);
      this.apiService.getCsgoRegistrations(this.tournamentId).subscribe(data => this.registrations = data);
      this.apiService.loadingCSGOMatches.subscribe(data => this.loadingMatches = data);
      this.apiService.getCsgoMatches(this.tournamentId).subscribe(data => {
        if (data) {
          data.forEach(item => item.startTime = new Date(item.startTime));
          this.csgomatches = data;
        }
      });
      this.apiService.getCSGOGroups(this.tournamentId).subscribe(data => this.groups = data);
    });
  }
}
