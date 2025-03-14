import { Component } from '@angular/core';
import {
  Tournament,
  BellumgensApiService,
  CSGOTeam
} from '../../../../../common/src/public_api';
import { ActivatedRoute } from '@angular/router';
// import { IgxGridModule, IgxAvatarModule, IgxListModule } from '@infragistics/igniteui-angular';


@Component({
    selector: 'app-team-tournaments',
    templateUrl: './team-tournaments.component.html',
    styleUrls: ['./team-tournaments.component.scss'],
    imports: []
})
export class TeamTournamentsComponent {
  public tournaments: Tournament [];
  public team: CSGOTeam;
  public emptyGuid = '00000000-0000-0000-0000-000000000000';

  constructor(private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent.params.subscribe(params => {
      const teamId = params['teamid'];
      if (teamId) {
        this.apiService.getTeam(teamId).subscribe(team => this.team = team);
        this.apiService.getTeamTournaments(teamId).subscribe(data => this.tournaments = data);
      }
    });
  }

}
