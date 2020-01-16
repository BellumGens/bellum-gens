import { Component, OnInit } from '@angular/core';
import { TournamentCSGORegistration, TournamentCSGOGroup, getEmptyNewCSGOGroup } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';

@Component({
  selector: 'app-admin-csgo',
  templateUrl: './admin-csgo.component.html',
  styleUrls: ['./admin-csgo.component.scss']
})
export class AdminCsgoComponent {
  public registrations: TournamentCSGORegistration [];
  public groups: TournamentCSGOGroup [];
  public loading = false;
  public environment = environment;
  public newGroup = getEmptyNewCSGOGroup();

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.csgoRegistrations.subscribe(data => this.registrations = data);
    this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data);
    this.apiService.getCSGOGroups().subscribe(data => this.groups = data);
  }

  public submitGroup(group: TournamentCSGOGroup) {
    group.inEdit = false;
    this.apiService.submitCSGOGroup(group).subscribe(data => {
      if (!this.groups.find(g => g.Id === data.Id)) {
        this.groups.push(data);
      }
    });
  }

  public deleteGroup(id: string) {
    this.apiService.deleteCSGOGroup(id).subscribe(_ => this.groups.splice(this.groups.indexOf(this.groups.find(g => g.Id === id)), 1));
  }
}
