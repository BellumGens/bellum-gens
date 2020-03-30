import { Component } from '@angular/core';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';

@Component({
  selector: 'app-team-tournaments',
  templateUrl: './team-tournaments.component.html',
  styleUrls: ['./team-tournaments.component.scss']
})
export class TeamTournamentsComponent {

  constructor(private apiService: ApiTournamentsService) { }

}
